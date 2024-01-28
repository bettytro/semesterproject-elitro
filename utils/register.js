import authFunctions from "./authFunctions.js";
import userFunctions from "./userFunctions.js";

const registerForm = document.querySelector("#registerForm");
const registerName = document.querySelector("#registerName");
const registerEmail = document.querySelector("#registerEmail");
const registerPassword = document.querySelector("#registerPassword");
const registerError = document.querySelector("#registerError");

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    registerError.textContent = "";
    console.log(registerName);
    const name = registerName.value;
    const email = registerEmail.value;
    const password = registerPassword.value;
    const emailDomain = registerEmail.value.split("@")[1];

    if (registerEmail.value === "") {
        registerError.textContent = "Email is required";
        return;
    } else if (emailDomain !== "stud.noroff.no" && emailDomain !== "noroff.no") {
        registerError.textContent = "Invalid email domain (must be stud.noroff.no or noroff.no)";
        return;
    }
    else if (registerPassword.value === "") {
        registerError.textContent = "Password is required";
        return;
    } else if (registerPassword.value.length < 8) {
        registerError.textContent = "Password must be at least 8 characters";
        return;
    }



    authFunctions.register(name, email, password)
        .then((user) => {
            console.log(user);
            userFunctions.setUser(user);
            registerError.textContent = "Registration successful. Redirecting to login page...";
            registerError.classList.remove("bg-red-500");
            registerError.classList.remove("hidden");
            registerError.classList.add("bg-green-500");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2500);
        })
        .catch((error) => {
            registerError.textContent = error.message;
            registerError.classList.remove("hidden");

        });
}
);



registerName.addEventListener("keyup", (e) => {
    const name = registerName.value;
    const nameRegex = /^[a-zA-Z0-9_]+$/;
    if (nameRegex.test(name) === false && name !== "") {
        console.log(nameRegex.test(name));
        registerError.textContent = "Invalid name format. Only letters, numbers, and underscores are allowed.";
        registerError.classList.remove("hidden");
    } else {
        registerError.textContent = "";
        registerError.classList.add("hidden");
    }
});

