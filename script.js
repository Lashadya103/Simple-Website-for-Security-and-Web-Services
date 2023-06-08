import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCkZvwiLKcYHgm7xiJ3xNt0xx3xkssT7Ts",
    authDomain: "fir-tutorial-b1da7.firebaseapp.com",
    projectId: "fir-tutorial-b1da7",
    storageBucket: "fir-tutorial-b1da7.appspot.com",
    messagingSenderId: "984426336157",
    appId: "1:984426336157:web:963afc55e1e61317cfa974",
    measurementId: "G-D8E0CQ9472"
});

const auth = getAuth(firebaseApp);

var signupbtn = document.getElementById("signupbtn");
var emailsignup = document.getElementById("useremail");
var passwordsignup = document.getElementById("userpass");



//============SignUp with Email and PW=========
signupbtn.onclick = function () {
    signupbtn.disabled = true;
    signupbtn.textContent = "Registering...";
    createUserWithEmailAndPassword(auth, emailsignup.value, passwordsignup.value)
        .then((userCredential) => {
            //signupbtn.disabled = false;
            //signupbtn.textContent = "Sign Up Sucess";
            sendingVerifyEmail(signupbtn);
            const user = userCredential.user;
            console.log(user);
        })
        .catch((error) => {
            signupbtn.disabled = false;
            signupbtn.textContent = "Sign Up";
            console.log(error);
        });
};

onAuthStateChanged(auth, function (user) {
    if (user != null) {
        console.log('logged in!');
    } else {
        console.log('No user');
    }
});

function sendingVerifyEmail(button) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.log("No current user");
        return;
    }

    sendEmailVerification(currentUser)
        .then((response) => {
            button.disabled = false;
            button.textContent = "Sign Up Success";
            console.log("Email verification sent");
            document.getElementById("signupmsg").textContent = "Check your email";
            console.log(response);
        })
        .catch((error) => {
            button.disabled = false;
            button.textContent = "Sign Up";
            console.log(error);
        });
}
//=======================End SIgnup==========================

//===============Login with Email and PW======================
var loginemail = document.getElementById("inputEmail");
var loginpassword = document.getElementById("inputPassword");
var loginbtn = document.getElementById("loginbtn");

loginbtn.onclick = function () {
    loginbtn.disabled = true;
    loginbtn.textContent = "Logging In...";
    signInWithEmailAndPassword(auth, loginemail.value, loginpassword.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            loginbtn.disabled = false;
            loginbtn.textContent = "Log In...";
            var userobj = userCredential.user;
            var token = userobj.accessToken;
            var provider = "email";
            var email = loginemail.value;
            if (token != null && token != undefined && token != "") {
                sendDatatoServerPhp(email, provider, token);
            }
            sendDatatoServerPhp();
        })
        .catch((error) => {
            console.log(error);
            loginbtn.disabled = false;
            loginbtn.textContent = "Log In...";
        });
};

//=====================End Login=============================

//================Saving Login details in Server Using Ajax===================
function sendDatatoServerPhp(email, provider, token) {

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            if (this.responseText == "Login Successful" || this.responseText == "User Created") {
                alert("Login Succsessfull");
                location = "home.html";
            }
            else if (this.responseText == "Please Verify Your Email to Login") {
                alert("Please Verify your email to login");
            }
            else {
               // alert("Error in Login");
            }
        }
    });

    xhr.open("POST", "http://localhost/assesment/login.php?email=" + email + "&provider=" + provider + "&username=" + email + "&token=" + token);

    xhr.send();
}


//=====================End Savinf Details in my Server====================