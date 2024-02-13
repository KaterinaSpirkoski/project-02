function initAuctionPage() {
  updateHeader();

  function auction() {
    const timer = document.querySelector(".timer");
    const storedTime = localStorage.getItem("timerForAuction");
    const auctionAlert = document.querySelector(".auction-alert");
    const cardContainer = document.querySelector("#auction .card-container");
    const bidContainer = document.querySelector(".bid-container");
    const bidAmountInput = document.querySelector("#bidAmount");
    const bidBtn = document.querySelector("#accept-bid");
    const listOfAllBiddings = document.querySelector(".all-bids-list");
    bidingForm = document.querySelector("#biding-form");
    finishedAuction = document.querySelector(".auction-done");

    let time;
    time = storedTime ? +storedTime : 120;
    localStorage.setItem("timerForAuction", time);
    const userType = localStorage.getItem("userType");
    const noBid = localStorage.getItem("noBid");
    const aucIndex = data.findIndex((item) => item.isAuctioning);

    currentBiddingItem = {};
    currentBiddingItem = data[aucIndex];
    cardContainer.innerHTML = "";

    itemsOnAuction = data.filter((item) => item.isAuctioning);

    if (userType === "artist") {
      disableBidButton();
    } else if (noBid !== null) {
      disableBidButton();
      clearBidAmountInput();
    } else {
      showBidForm();
    }

    function disableBidButton() {
      bidBtn.disabled = true;
    }
    function clearBidAmountInput() {
      bidAmountInput.value = "";
    }
    function showBidForm() {
      bidingForm.style.display = "block";
    }
    document.querySelector(".live-auctioning").style.display =
      itemsOnAuction.length >= 1 ? "block" : "none";
    auctionAlert.classList.toggle("d-none", itemsOnAuction.length >= 1);
    cardContainer.classList.toggle("d-none", itemsOnAuction.length < 1);
    bidContainer.classList.toggle("d-none", itemsOnAuction.length < 1);

    if (itemsOnAuction.length >= 1) {
      currentBiddingItem = itemsOnAuction[0];
      let itemPrice = Math.floor(currentBiddingItem.price / 2);
      bidAmountInput.min = itemPrice;

      itemsOnAuction.forEach(createAuctionCard);
      auctionPage();
    }

    function auctionPage() {
      indexOfBiddingItem = data.findIndex(
        (item) => item.id === currentBiddingItem.id
      );
      let allBiddings;
      allBiddings = localStorage.getItem("allBiddings")
        ? JSON.parse(localStorage.getItem("allBiddings"))
        : [];
      const bidAmountInput = document.getElementById("bidAmount");

      function createBidListItem(bid, idx) {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.innerText = `I bid ${+bid}`;
        li.classList.add(idx % 2 === 1 ? "others-bid" : "mine-bid");
        li.appendChild(p);
        listOfAllBiddings.append(li);

        const newMin = +bid + 30;
        bidAmountInput.setAttribute("min", newMin);
        bidAmountInput.value = newMin;
      }

      allBiddings.forEach(createBidListItem);

      let timerInterval;
      function secondsToTime(seconds) {
        minutes = Math.floor(seconds / 60);
        remainingSeconds = seconds - minutes * 60;
        ss = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
        mm = minutes < 10 ? `0${minutes}` : minutes;
        return `${mm}:${ss}`;
      }
      function setTimer(time) {
        if (timerInterval) {
          clearInterval(timerInterval);
        }

        timer.innerText = secondsToTime(time);

        timerInterval = setInterval(() => {
          if (time <= 0) {
            clearInterval(timerInterval);
            completeAuction();
            return;
          }

          time--;
          localStorage.setItem("timerForAuction", time);

          timer.innerText = secondsToTime(time);
        }, 1000);
      }

      function completeAuction() {
        data[indexOfBiddingItem].dateSold = new Date();
        const soldPrice = +allBiddings[allBiddings.length - 1];
        data[indexOfBiddingItem].priceSold = soldPrice;
        data[indexOfBiddingItem].isAuctioning = false;
        finishedAuction.style.display = "block";
        bidingForm.style.display = "none";
        removeLocalStorageItems(["timerForAuction", "allBiddings", "noBid"]);
        saveData();

        const cardToUpdate = document.querySelector(
          `[data-item-id="${currentBiddingItem.id}"]`
        );
        if (cardToUpdate) {
          const soldPriceElement = cardToUpdate.querySelector(".price");
          soldPriceElement.textContent = `${soldPrice}$`;
        }
      }

      function removeLocalStorageItems(items) {
        items.forEach((item) => {
          window.localStorage.removeItem(item);
        });
      }
      setTimer(time);

      function startBidding(e) {
        e.preventDefault();
        bidBtn.disabled = true;
        const bidAmount = +bidAmountInput.value;
        const userBidLi = createBidListItem(`I bid ${bidAmount}`, "mine-bid");
        listOfAllBiddings.appendChild(userBidLi);
        allBiddings.push(bidAmount);
        saveAllBiddingsToLocalStorage();

        makeBid(bidAmount).then((data) => {
          const { isBidding, bidAmount } = data;

          if (isBidding) {
            setTimeout(() => {
              updateTimerAndOtherBid(bidAmount);
            }, 7000);
          } else {
            setTimeout(() => {
              displayWinMessage();
            }, 5000);
          }
        });
      }
      function createBidListItem(text, className) {
        const bidLi = document.createElement("li");
        const bidP = document.createElement("p");
        bidP.innerText = text;
        bidLi.classList.add(className);
        bidLi.appendChild(bidP);
        return bidLi;
      }

      function updateTimerAndOtherBid(bidAmount) {
        time += 60;
        setTimer(time);

        const otherBidLi = createBidListItem(
          ` ${bidAmount} here`,
          "others-bid"
        );
        listOfAllBiddings.appendChild(otherBidLi);
        allBiddings.push(bidAmount);
        saveAllBiddingsToLocalStorage();
        bidAmountInput.min = bidAmount + 30;
        bidAmountInput.value = bidAmount + 30;
        bidBtn.disabled = false;
      }

      function displayWinMessage() {
        bidBtn.disabled = true;
        const winLi = createBidListItem("You won the auction", "others-bid");
        listOfAllBiddings.appendChild(winLi);
        localStorage.setItem("noBid", "true");
      }
      function saveAllBiddingsToLocalStorage() {
        localStorage.setItem("allBiddings", JSON.stringify(allBiddings));
      }
      bidingForm.removeEventListener("submit", startBidding);
      bidingForm.addEventListener("submit", startBidding);
    }

    function makeBid(amount) {
      const url = "https://projects.brainster.tech/bidding/api";

      const bidAmountInput = document.querySelector("#bidAmount");
      const bidAmount = +bidAmountInput.value;

      const data = new FormData();
      data.set("amount", bidAmount);

      return fetch(url, {
        method: "POST",
        body: data,
      }).then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to make a bid");
        }
      });
    }

    function createAuctionCard(item) {
      const card = document.createElement("div");
      card.classList.add("card-inner", "dark");
      card.setAttribute("data-item-id", item.id);
      const cardImage = createCardImage(item.image);
      const cardHeader = createCardHeader(item);
      const cardBody = createCardBody(item);
      card.append(cardImage, cardHeader, cardBody);
      cardContainer.appendChild(card);
    }

    function createCardImage(imageUrl) {
      const cardImage = document.createElement("div");
      cardImage.classList.add("card-img");
      cardImage.innerHTML = `<img src="${imageUrl}" alt="">`;
      return cardImage;
    }

    function createCardHeader(item) {
      const cardHeader = document.createElement("div");
      cardHeader.classList.add("card-header");
      cardHeader.innerHTML = `
        <div class="name-inner">
          <h3 class="artist-name">${item.artist}</h3>
        </div>
        <div class="price-inner">
          <span class="price">$${Math.floor(item.price / 2)}</span>
          <span class="sticker">On <br> Auction</span>
        </div>
      `;
      return cardHeader;
    }

    function createCardBody(item) {
      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
      cardBody.innerHTML = `
        <p>${item.title}</p>
        <p>${item.description}</p>
      `;
      return cardBody;
    }
  }

  auction();
}
