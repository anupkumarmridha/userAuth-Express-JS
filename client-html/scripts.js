//conection between fonthand and backhand

export const handleRegister = document.getElementById("registerButton");
if(handleRegister) {
    handleRegister.addEventListener("click", async(event)=>
    {
        const form =document.getElementById("registerForm");
        const name = form.elements.name.value;
        const email = form.elements.email.value;
        const password = form.elements.password.value;
        const confirm_password = form.elements.confirm_password.value;

        console.log(form);
        try{
            const response = await fetch("http://localhost:8000/api/user/register",{
                method: "POST",
                headers: {
                    "Content-Type" :"application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    password_confirmation: confirm_password,
                }),
            });
            console.log(response);
            const data = await response.json();

            if(response.status === 201)
                {
                    alert("successfully registered", data.message);
                    window.location.href="/log_in.html";
                }
                else{
                    alert("Failed to register", data.message)
                }
             }
    catch(error){
        console.log(error);
    }
});
}
export const handleLogin = document.getElementById("loginButton");
if(handleLogin) {
    handleLogin.addEventListener("click", async(event)=>
    {
        const form =document.getElementById("loginForm");
        const email = form.elements.email.value;
        const password = form.elements.password.value;

        console.log(form);
        try{
            const response = await fetch("http://localhost:8000/api/user/login",{
                method: "POST",
                headers: {
                    "Content-Type" :"application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            console.log(response);
            const data = await response.json();
            console.log(data.massage)
            console.log(data.token)
            if(response.status === 200)
                {
                    alert("Successfully logged in");
                    localStorage.setItem("token", data.token);
                    window.location.href="/userProfile.html";
                }
                else
                {
                    alert("error: " + data.massage);
                }
                
             }
    catch(error){
        console.log(error);
    }
});

}
export const fectUserDetails = async()=>{
    try{
        console.log("first")
        const token = localStorage.getItem("token");
        if(token){
            const response = await fetch("http://localhost:8000/api/user/user_details",{
                method:"GET",
                headers: {
                   "Content-Type": "application/json",
                   "Authorization": `Bearer ${token}`
                }
                
            });
            const data = await response.json();
            console.log(data)
            document.getElementById("name").innerHTML = data.user.name;
            document.getElementById("email").innerHTML = data.user.email;
        }
        else{
            alert("Unauthorized user");
        }
    }
    catch (err) {
        console.log(err);
    }
}