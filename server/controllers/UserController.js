import UserModel from '../models/User.js';
import bcrypt from "bcrypt";//decryption and encryption
import jwt from 'jsonwebtoken';


class UserController {
    static userResgistration = async (req, res) => {

        const { name, email, password, password_confirmation } = req.body
        const user = await UserModel.findOne({ email: email })//to check if user is already registered by this email
        if (user) {
            res.status(409).send({ status: "failed", message: "Email already exists" });
        }
        else {
            if (name && email && password && password_confirmation) {
                if (password == password_confirmation) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        console.log(salt)
                        const hashPassword = await bcrypt.hash(password, salt);
                        console.log(hashPassword)
                        const user = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                        })
                        await user.save();
                        //generate jwt token
                        const saved_user = await UserModel.findOne({ email: email });
                        const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

                        res.status(201).send({ sataus: "success", message: " successfully registered", token: token });

                    }
                    catch (e) {
                        console.log(e);
                        res.status(500).send({ status: "failed", message: "Uable to register" });
                    }
                }
                else {
                    res.status(400).send({ status: "failed", message: "password should be match" });
                }

            }
            else {
                res.status(400).send({ status: "bad request", message: "All fields are required" });
            }
        }

        /*   
           try {
            const { name, email, password, password_confirmation } = req.body
            if(!name || !email || !password || !password_confirmation){
                res.status(400).send({ status: "bad request", message: "all fields are required" });
            }
            const user = await UserModel.findOne({ email: email })//to check if user is already registered by this email
            if (user) {
                res.status(409).send({ status: "failed", message: "Email already exists" });
            }
            if(password.length<6 ){
                res.status(400).send({ status: "bad request", message: "Password must be at least 6 characters" });
            }
            if(password!==password_confirmation){
                res.status(400).send({ status: "failed", message: "password and confirmation password do not match" });
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password,salt);
                const newUser = new UserModel({
                    name: name,
                    email: email,
                    password: hashPassword,
                });
                const saved_user=await newUser.save();
                console.log(saved_user);
                const token = jwt.sign({userID: saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
                res.status(201).send({sataus:"success",message:" successfully registered",user:saved_user,token:token});
            }
            
           } catch (error) {
            console.log(error);
            res.status(500).send({status: "failed", message:"Uable to register"});
           }*/
    }

    //login function
    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await UserModel.findOne({ email: email });
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    console.log(isMatch)
                    if ((user.email === email) && isMatch) {
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
                        res.status(200).send({ status: "success", message: "successfully logged in", token: token });
                    }
                    else {
                        res.status(404).send({ status: "failed", message: "email or password is incorrect" });
                    }
                }
                else {
                    res.status(404).send({ status: "failed", message: "You are not registered user" });
                }
            }
            else {
                res.status(400).send({ status: "failed", message: "All filled are requeried" });
            }

        } catch (error) {
            res.status(500).send({ status: "failed", message: "unable to login" });
        }
    }
    static changePassword = async (req, res) => {

        try {
            const { password, password_confirmation } = req.body;
            if (!password || !password_confirmation) {
                res.status(400).send({ status: "bad request", message: "all fields are required" });
            }
            // if(password === password_confirmation)
            // {
            //     const salt =await bcrypt.genSalt(10);
            //     const hashPassword = await bcrypt.hash(password, salt);
            //     await UserModel.findByIdAndUpdate(req.user._id,{$set:{password:hashPassword}});

            //     res.send({state:"success",message: "Password changed successfully"});

            // }

            if (password !== password_confirmation) {
                res.status(403).send({ state: "failed", message: "Invalid password" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: hashPassword } });

            res.send({ state: "success", message: "Password changed successfully" });
        }
        catch (err) {
            res.status(500).send({ status: "bad request", message: "internal server error" });
        }

    }

    //reset password
    static resetPasswordSendMail = async (req, res) => {
        try {
            const { email } = req.body;
            console.log(email)
            if (email) {
                const user = await UserModel.findOne({ email: email });
                if (user) {
                    const secret = user._id + process.env.JWT_SECRET_KEY;
                    const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" })

                    const link = `http://127.0.0.1:8000/api/user/reset/${user._id}/${token}`
                    console.log(link)
                    res.status(200).send({ status: "success", message: "verification mail send successfully" })
                }
                else {
                    res.status(404).send({ status: "failure", message: "You are not registered user" });
                }
            }
            else {
                res.status(404).send({ status: "failure", message: "All field are required" });
            }
        }
        catch (err) {
            res.status(500).send({ status: "bad request", message: "internal server error" });
        }


    }
    static userresetPassword = async (req, res) => {
        const { password, password_confirmation } = req.body;
        const { id, token } = req.params;
        const user = await UserModel.findById(id);
        const new_secret = user._id + process.env.JWT_SECRET_KEY;
        console.log(user)
        try {
            jwt.verify(token, new_secret);
            if (password_confirmation === password) {
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt);
                await UserModel.findByIdAndUpdate(user._id, { $set: { password: hashPassword } });
                res.status(200).send({ status: "success", message: "reset password successfully" });
            }
            else {
                res.status(400).send({ status: "failed", message: "password does not match" });
            }
        }

        catch (err) {
            res.status(500).send({ status: "failed", message: "internal server error" });
        }
    }
    static user_details = async (req, res) => {
        res.status(200).send({ status: "success", "user": req.user });

    }
}
export default UserController;
