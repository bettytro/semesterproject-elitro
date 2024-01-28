import authFunctions from "./authFunctions.js";
import helperFunctions from "./helperFunctions.js";
function getNameFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const firstParamName = Array.from(urlParams.keys())[0];
    let firstParamValue = urlParams.get(firstParamName);
    if (!firstParamValue) {
        firstParamValue = firstParamName;
    }

    return firstParamValue;    
}
function getBidsByUser(name) {
    const authHeader = authFunctions.getAuthHeader();
    const headers = {
        'Authorization': authHeader
    };
    const url = `https://api.noroff.dev/api/v1/auction/profiles/${name}/bids`;
    console.log(url);
    return fetch(url, { headers })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const bids = document.querySelector("#bidsContainer");
                let html = "";
                
                data.forEach(bid => {
                    const createdTime = helperFunctions.prettifyDate(bid.created);
                    html += `
                    <div class="flex justify-between items-center bg-slate-300 px-4 py-2 mb-2">
                        <div>
                            <a href="listing.html?id=${bid.id}" class="text-md">${bid.id}</a>
                            <p class="text-xs">${createdTime}</p>
                        </div>
                        <p class="text-xl">$${bid.amount}</p>
                    </div>
                    `;
                });
                
                bids.innerHTML = html;
            }
            )
            .catch(error => {
                    console.error(error);
                    throw error;
            });
}
     

function getUserProfileByName(name) {
    const authHeader = authFunctions.getAuthHeader();
    const headers = {
        'Authorization': authHeader
    };



    console.log(name);
    const url = `https://api.noroff.dev/api/v1/auction/profiles/${name}`;
    console.log(url);
    return fetch(url, { headers })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const profileName = document.querySelector("#title");
                const profileImage = document.querySelector("#image");
                const profileEmail = document.querySelector("#email");
                const credits = document.querySelector("#credits");

                profileEmail.textContent = data.email;
                profileEmail.href = `mailto:${data.email}`;
                profileName.textContent = data.name;
                profileImage.src = data.avatar || "images/user.png";
                profileImage.alt = data.name;
                credits.textContent = data.credits;
            })
            .catch(error => {
                    console.error(error);
                    throw error;
            });
}


getUserProfileByName(getNameFromUrl());
getBidsByUser(getNameFromUrl());