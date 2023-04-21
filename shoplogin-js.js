const usernameInput = document.querySelector(".user-input");
const passwordInput = document.querySelector(".pass-input");
const usernameMessage = document.querySelector(".username-msg");
const passwordMessage = document.querySelector(".password-msg");
const loginMessage = document.querySelector(".login-status");
const loginBtn = document.querySelector(".login-button");

loginBtn.addEventListener("click", logIn);
function logIn(event) {
    event.preventDefault();
    let usernameValue = usernameInput.value;
    const passwordValue = passwordInput.value;
    usernameMessage.innerText = "";
    passwordMessage.innerText = "";
    let ifSendData = true;
    if (usernameValue.length === 0 	|| usernameValue.indexOf("@") === -1 || usernameValue.indexOf(".") === -1) {
        usernameMessage.innerText = "Please enter a valid Email";
        ifSendData = false;
    }
    if (passwordValue.length === 0 || passwordValue.length <= 8) {
        passwordMessage.innerText = "Please enter an 8-digit password";
        ifSendData = false;
    }
    if (ifSendData) {
        const body = JSON.stringify({
            username : usernameValue,
            password : passwordValue,
        });
        fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: body,
                headers: {
                'Content-type': 'application/json; charset=UTF-8',
                },
            })
        .then((response) => {
            if (response.ok) {
                loginMessage.innerText = "Log In Successfully "
            }
        })
    }
}

