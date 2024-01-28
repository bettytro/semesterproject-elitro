import userFunctions from "./userFunctions.js";

function signIn(email, password) {
    const url = "https://api.noroff.dev/api/v1/auction/auth/login";
    const data = JSON.stringify({ email: email, password: password });

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Sign in failed");
        }
    })

    .catch(error => {
        console.error(error);
        throw error;
    });
}

function signOut() {
    userFunctions.removeUser();
    window.location.href = "index.html";
}



function register(name, email, password) {
    const validEmailDomains = ["@stud.noroff.no", "@noroff.no"];
    const isValidEmail = validEmailDomains.some(domain => email.endsWith(domain));

    if (!isValidEmail) {
        throw new Error("Invalid email domain");
    }

    const url = "https://api.noroff.dev/api/v1/auction/auth/register";
    const data = JSON.stringify({ name: name, email: email, password: password });

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Registration failed");
        }
    })
    .catch(error => {
        console.error(error);
        throw error;
    });
}

function getAuthHeader() {
    const user = userFunctions.getUser();
    if (user && user.accessToken) {
        return `Bearer ${user.accessToken}`;
    }
    return "";
}

function createListing(title, description, imageUrl, endsAt) {
    const url = "https://api.noroff.dev/api/v1/auction/listings";
    const data = JSON.stringify({ title: title, description: description, imageUrl: imageUrl, endsAt: endsAt });



    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader()
        },
        body: data
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Create listing failed");
        }
    })
    .catch(error => {
        console.error(error);
        throw error;
    });
}

function getListingById(id) {
    const url = `https://api.noroff.dev/api/v1/auction/listings/${id}?_bids=true&_seller=true`;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error(error);
        });
}
function createBid(id, amount) {
    const url = `https://api.noroff.dev/api/v1/auction/listings/${id}/bids`;
    const data = JSON.stringify({ amount: amount });

    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getAuthHeader()
        },
        body: data
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Create bid failed");
        }
    })
    .catch(error => {
        console.error(error);
        throw error;
    });
}

export default {
    signIn,
    signOut,
    register,
    getAuthHeader,
    createListing,
    getListingById,
    createBid
}