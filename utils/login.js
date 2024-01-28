import authFunctions from "./authFunctions.js";
import userFunctions from "./userFunctions.js";

const loginForm = document.querySelector("#loginForm");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const signInError = document.querySelector("#signInError");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log(loginEmail.value);

    const emailDomain = loginEmail.value.split("@")[1];

    if (loginEmail.value === "") {
        signInError.textContent = "Email is required";
        signInError.classList.remove("hidden");
        return;
    } else

        if (emailDomain !== "stud.noroff.no" && emailDomain !== "noroff.no") {
            signInError.textContent = "Invalid email domain (must be stud.noroff.no or noroff.no)";
            signInError.classList.remove("hidden");
            return;
        } else
            if (loginPassword.value === "") {
                signInError.textContent = "Password is required";
                signInError.classList.remove("hidden");
                return;
            } else if (loginPassword.value.length < 8) {
                signInError.textContent = "Password must be at least 8 characters";
                signInError.classList.remove("hidden");
                return;
            }


    signInError.textContent = "";
    signInError.classList.add("hidden");
    const email = loginEmail.value;
    const password = loginPassword.value;

    authFunctions.signIn(email, password)
        .then((user) => {
            console.log(user);
            userFunctions.setUser(user);
            signInError.textContent = "Login successful. Redirecting to listings page...";
            signInError.classList.remove("bg-red-500");
            signInError.classList.remove("hidden");
            signInError.classList.add("bg-green-500");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2500);
    ;
        })
        .catch((error) => {
            signInError.textContent = error.message;
            signInError.classList.remove("hidden");
        });
});



