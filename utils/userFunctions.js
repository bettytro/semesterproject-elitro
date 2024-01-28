function getUser() {
    let user = localStorage.getItem('user');
    if (user) {
        return JSON.parse(user);
    }
    return null;
}

function setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function removeUser() {
    localStorage.removeItem('user');
}



export default {
    getUser,
    setUser,
    removeUser
}

