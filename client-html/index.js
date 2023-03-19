// function decleartion
export const submitButton = document.getElementById("submitButton");
if(submitButton){
    submitButton.addEventListener("click", function () {
        const form = document.getElementById("registerForm");
        const username = form.elements.Username.value;
        const name = form.elements.name.value;
        const email = form.elements.email.value;
        const password = form.elements.password.value;
        const confirmPassword = form.elements.confirm_password.value;
    
        if (!username || !name || !email || !password || !confirmPassword) {
            alert("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords is not match");
            return;
        }
        
        localStorage.clear();
    
        const data = {
            username: username,
            name: name,
            email: email,
            password: password
        };
    
        // localStorage.setItem("userData", JSON.stringify(data));
        localStorage.setItem("username", data.username);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("password", data.password);
    
        window.location = "http://127.0.0.1:5500/public/log_in.html";
        // perform additional actions with the form values
    });
}
    

export const loginButton = document.getElementById("loginButton");
if(loginButton){

    loginButton.addEventListener("click", function () {
        const form = document.getElementById("loginForm");
        const username = form.elements.username.value;
        const password = form.elements.password.value;
    
        const exitUsername = localStorage.getItem("username");
        const exitPassword = localStorage.getItem("password");
    
        if(!username || !password){
            alert("All fields are required");
        }
        if (!exitUsername) {
            alert("Please register first then came to login");
            return;
        }
    
        if(username!==exitUsername) {
            alert("Username not matched");
            return;
        }
    
        if (password !== exitPassword) {
            alert("incorrect password");
        }
    
        window.location = "http://127.0.0.1:5500/public/userProfile.html";
    
    });
}

export const UserProfile = () => {
    const username = localStorage.getItem("username");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    console.log(username)
    const usernameContainer = document.getElementById("username");
    usernameContainer.innerHTML = "<strong>Username: </strong>" + username;

    const nameContainer = document.getElementById("name");
    nameContainer.innerHTML = "<strong>Name: </strong>" + name;

    const emailContainer = document.getElementById("email");
    emailContainer.innerHTML = "<strong>Email: </strong>" + email;
}

