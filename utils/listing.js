import authFunctions from "./authFunctions.js";
import helperFunctions from "./helperFunctions.js";
function getListingId() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id;
}

function populateListing(listing) {
    console.log(listing);
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    const image = document.querySelector("#image");
    const seller = document.querySelector("#seller");
    const sellerImg = document.querySelector("#sellerImg");
    const sellerEmail = document.querySelector("#sellerEmail");
    const createdAt = document.querySelector("#createdAt");
    const endsAt = document.querySelector("#endsAt");
    const timeLeftEl = document.querySelector("#timeLeftEl");


    const createdTime = helperFunctions.prettifyDate(listing.created);
    const endsAtTime = helperFunctions.prettifyDate(listing.endsAt);
    const timeLeft = helperFunctions.timeUntilEnd(listing.endsAt);
    
        timeLeftEl.textContent = `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`;
    

    endsAt.textContent = endsAtTime;
    


    title.textContent = listing.title;
    description.textContent = listing.description;
    image.src = listing.media[0];
    seller.textContent = listing.seller.name;
    sellerImg.src = listing.seller.avatar || 'images/user.png';
    sellerEmail.href = `mailto:${listing.seller.email}`;
    sellerEmail.textContent = listing.seller.email;
    createdAt.textContent = createdTime;
}

function updateListing() {
    const id = getListingId();
    authFunctions.getListingById(id)
        .then((listing) => {
            populateListing(listing);
            populateBids(listing);
        })
        .catch((error) => {
            console.log(error);
        });
}

function populateBids(listing) {
    const bidsContainer = document.querySelector("#bidsContainer");
    bidsContainer.innerHTML = "";
    
    const sortedBids = listing.bids.sort((a, b) => b.amount - a.amount);
    const highestBid = sortedBids[0];
    const currentBid = document.querySelector("#currentBid");
    const bidInput = document.querySelector("#bidInput");
    const bidButton = document.querySelector("#bidButton");
    const bidError = document.querySelector("#bidError");
    if (highestBid) {
        currentBid.textContent = `$${highestBid.amount}`;
    }
    bidButton.addEventListener("click", () => {
        const amount = parseInt(bidInput.value);
        
        if (isNaN(amount)) {
            bidError.textContent = "Invalid bid amount";
            bidError.classList.remove("hidden");
            return;
        }
        
        if (amount <= highestBid.amount) {
            bidError.textContent = "Bid must be higher than current highest bid";
            bidError.classList.remove("hidden");
            return;
        }
        console.log(amount);

        const id = getListingId();
        console.log(id, amount)
        authFunctions.createBid(id, amount)
            .then((bid) => {
                console.log(bid);
                updateListing();
                bidError.textContent = "Bid created successfully";
            })
            .catch((error) => {
                console.log(error);
                bidError.textContent = error.message;
                bidError.classList.remove("hidden");
            });
    });


    sortedBids.forEach(bid => {
        const createdTime = helperFunctions.prettifyDate(bid.created);
        bidsContainer.innerHTML += `
        <div class="flex justify-between items-center bg-slate-300 px-4 py-2 mb-2">
            <div>
                <p class="text-md">${bid.bidderName}</p>
                <p class="text-xs">${createdTime}</p>
            </div>
            <p class="text-xl">$${bid.amount}</p>
        </div>
        `;
    });
} 

updateListing();