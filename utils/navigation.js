import userFunctions from "./userFunctions.js";
import authFunctions from "./authFunctions.js";

function updateNav() {
    const user = userFunctions.getUser();
    const nav = document.querySelector('nav ul');

    nav.innerHTML = `
        <li class="px-4"><a href="index.html">Listings</a></li>
        ${user ? `
            <li class="px-4" id="logoutButton"><a href="#">Logout</a></li>
            <li class="px-4"><a href="profile.html?${user.name}">Profile</a></li>
        ` : `
            <li class="px-4" id="loginButton"><a href="login.html">Login</a></li>
            <li class="px-4" id="registerButton"><a href="register.html">Register</a></li>
        `}
    `;
    if (user) {
        const logoutButton = document.querySelector("#logoutButton");
        logoutButton.addEventListener("click", (e) => {
            e.preventDefault();
            authFunctions.signOut();
        });
    }
}

updateNav();

