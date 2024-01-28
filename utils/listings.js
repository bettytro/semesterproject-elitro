import authFunctions from "./authFunctions.js";
import userFunctions from "./userFunctions.js";
import helperFunctions from "./helperFunctions.js";

function getListings() {
    const url = "https://api.noroff.dev/api/v1/auction/listings?_bids=true&_active=true";
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error(error);
        });
}


function visualizeListings(listings) {
    const listingsContainer = document.querySelector(".listings-container");
    listingsContainer.innerHTML = "";
    console.log(listings);
    listings.forEach(listing => {
        const imageUrl = listing.media[0] ? listing.media[0] : 'images/default.webp';
        const createdDate = helperFunctions.prettifyDate(listing.created);
        const timeLeft = helperFunctions.timeUntilEnd(listing.endsAt);

        let highestBid, bidderName, bidAmount;
        if (listing.bids.length > 0) {
            highestBid = listing.bids.reduce((prevBid, currentBid) => {
                return (currentBid.amount > prevBid.amount) ? currentBid : prevBid;
            });
            console.log(highestBid)
            bidderName = highestBid.bidderName;
            bidAmount = highestBid.amount;
        } else {
            bidderName = 'No bids yet';
            bidAmount = 'N/A';
        }


        listingsContainer.innerHTML += `
        <a class="pointer relative" href="listing.html?id=${listing.id}">
            <div class="listing max-w-[300px] flex flex-col justify-between h-full gap-4">
            <div>
                <img width="300" class="w-[300px] h-[300px] object-cover" src="${imageUrl} alt="${listing.title}">
                <div class="absolute top-4 left-4 bg-green-500 w-12 h-12 flex items-center justify-center rounded-full text-white p-2">${listing._count.bids}</div>
                <h2 class="text-xl my-2 break-words">${listing.title}</h3>
                <p class="text-md my-1 break-words">${listing.description}</p>
                <p class="text-xs">${createdDate}</p>
                <p class="text-xs">Ends in: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes</p>
            </div>
                <p class="text-xs bg-slate-300 px-8 py-4">Highest Bid: ${bidderName} - $${bidAmount}</p>
            
            </div>
        </a>
        `;
    });
}

getListings().then(listings => visualizeListings(listings));

function profileBox() {
    const user = userFunctions.getUser();
    console.log(user);
    const profileBox = document.querySelector(".profile-box");
    const createButton = document.querySelector("#createButton");
    if (!user) {
        createButton.classList.add("hidden");
        profileBox.innerHTML = `
        <h2 class="text-2xl">Welcome, guest</h2>
        <p class="text-md">Please login to view your profile</p>
    `;
        return;
    }
    const avatarUrl = user.avatar ? user.avatar : 'images/user.png';
    profileBox.innerHTML = `
        <div class="flex flex-col justify-between gap-12">
        <div>
        <img class="w-20 h-20 rounded-full object-cover mb-6" src="${avatarUrl} alt="${user.name}">
        <h2 class="text-2xl">Welcome, ${user.name}</h2>
        <a href="mailto:${user.email}" class="text-md">${user.email}</a>
        </div>
        <p class="text-md">You have ${user.credits} credits</p>
    `;
}

const createButton = document.querySelector("#createButton");
const modal = document.querySelector("#modal");

createButton.addEventListener("click", () => {
    modal.showModal();
}
);

const createForm = document.querySelector("#createForm");
const createTitle = document.querySelector("#createTitle");
const createDescription = document.querySelector("#createDescription");
const createImage = document.querySelector("#createImageUrl");
const createEndsAt = document.querySelector("#createEndsAt");
const createError = document.querySelector("#createError");

createForm.addEventListener("submit", (e) => {
    e.preventDefault();

    createError.textContent = "";
    console.log(createTitle);
    const title = createTitle.value;
    const description = createDescription.value;
    const imageUrl = createImage.value;
    const endsAt = createEndsAt.value;

    console.log(title, description, imageUrl, endsAt);

    if (createTitle.value === "") {
        createError.textContent = "Title is required";
        return;
    } else if (createDescription.value === "") {
        createError.textContent = "Description is required";
        return;
    } else if (createImage.value === "") {
        createError.textContent = "Image URL is required";
        return;
    } else if (createEndsAt.value === "") {
        createError.textContent = "Ends at is required";
        return;
    }

    authFunctions.createListing(title, description, imageUrl, endsAt)
        .then((listing) => {
            console.log(listing);
            createError.textContent = "Listing created successfully. Redirecting to listings page...";
            createError.classList.remove("bg-red-500");
            createError.classList.remove("hidden");
            createError.classList.add("bg-green-500");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2500);
            console.log('Listing created successfully');
        })
        .catch((error) => {
            createError.textContent = error.message;
            createError.classList.remove("hidden");

        });
}
);


profileBox();