function initArtistsItemsPage() {
  updateHeader();
}

artistName = localStorage.getItem("currentArtist");
let artistsItemsData = data.filter((item) => item.artist == artistName);
let cardContainer = document.querySelector("#artist-items .card-container");
let idNumber = data[data.length - 1].id + 1;
console.log(idNumber);

function artistItemsPage() {
  let addNewItem = document.querySelector("#add-new-item-form");
  let addNewItemBtn = document.querySelector("#add-new-item-btn");
  let cardContainer = document.querySelector("#artist-items .card-container");
  let artistsItemsData = data.filter((item) => item.artist == artistName);
  let isPublishedItem = document.querySelector("#isPublished");
  let itemTitle = document.querySelector("#itemTitle");
  let itemDescription = document.querySelector("#itemDescription");
  let itemType = document.querySelector("#itemType");
  const cancelBtn = document.querySelector("#cancel-btn");
  let itemPrice = document.querySelector("#itemPrice");
  let itemImage = document.querySelector("#itemImgUrl");
  const video = document.querySelector("#capture-image-Popup video");
  const canvas = document.querySelector("#camcanvas");
  const img = document.querySelector(".capturedImage");
  let isEditing = false;
  let index;

  itemTypes.forEach((type, index) => {
    let option = document.createElement("option");
    if (index === 0) {
      option.selected = true;
    }
    option.value = type;
    option.innerText = type;
    itemType.appendChild(option);
  });

  renderCards(artistsItemsData, cardContainer);
  cancelBtn.removeEventListener("click", changePage);
  cancelBtn.addEventListener("click", changePage);

  addNewItemBtn.removeEventListener("click", changePage);
  addNewItemBtn.addEventListener("click", changePage);

  addNewItem.removeEventListener("submit", addNewCard);
  addNewItem.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewCard(e);
  });
  function addNewCard(e) {
    e.preventDefault();
    if (isEditing) {
      data[index] = {
        ...data[index],
        title: itemTitle.value,
        description: itemDescription.value,
        type: itemType.value,
        image: itemImage.value,
        price: itemPrice.value,
        isPublished: isPublishedItem.checked,
      };
      saveData();
      artistsItemsData = data.filter((item) => item.artist == artistName);
      renderCards(artistsItemsData, cardContainer);
      changePage(e);
      isEditing = false;
      stopVideo();
    } else {
      let artistItem = {
        id: idNumber++,
        title: itemTitle.value,
        description: itemDescription.value,
        type: itemType.value,
        image: itemImage.value,
        price: itemPrice.value,
        artist: artistName,
        dateCreated: new Date().toString(),
        isPublished: isPublishedItem.checked ? true : false,
        isAuctioning: false,
        priceSold: 0,
      };
      data.push(artistItem);
      saveData();
      artistsItemsData = data.filter((item) => item.artist == artistName);
      renderCards(artistsItemsData, cardContainer);
      changePage(e);
      stopVideo();
    }
  }

  function createCard(array, item) {
    let card = document.createElement("div");
    card.classList.add("card-inner");
    let cardImg = document.createElement("div");
    cardImg.innerHTML = `<img
          src=${item.image}
          alt="">`;
    cardImg.classList.add("card-img");
    let cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    cardHeader.innerHTML = `
          <div class="left">
                      <h3 class="title">${item.title}</h3>
                      <span class="date">${writeDate(item.dateCreated)}</span>
                    </div>
                    <div class="right">
                      <span class="price">$${item.price}</span>
                    </div>
          `;
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.innerHTML = `<p>${item.description}</p>`;
    let cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer");

    let sendAuctionBtn = document.createElement("button");
    sendAuctionBtn.classList.add("sendToAuctionBtn");
    sendAuctionBtn.id = item.id;
    sendAuctionBtn.innerText = "Send to auction";
    if (
      item.priceSold ||
      data.filter((item) => item.isAuctioning == true).length >= 1
    ) {
      sendAuctionBtn.setAttribute("disabled", "");
    }
    let publishBtn = document.createElement("button");
    publishBtn.classList.add("publishBtn");
    publishBtn.id = item.id;
    if (item.isPublished) {
      publishBtn.innerText = "Unpublish";
    } else {
      publishBtn.innerText = "Publish";
      publishBtn.classList.add("unpublishBtn");
    }

    let removeBtn = document.createElement("button");
    removeBtn.classList.add("removeBtn");
    removeBtn.id = item.id;
    removeBtn.innerText = "Remove";

    let editBtn = document.createElement("button");
    editBtn.classList.add("editBtn");
    editBtn.id = item.id;
    editBtn.innerText = "Edit";
    cardFooter.append(sendAuctionBtn, publishBtn, removeBtn, editBtn);
    card.append(cardImg, cardHeader, cardBody, cardFooter);
    cardContainer.appendChild(card);

    sendAuctionBtn.removeEventListener("click", sendToAuction);
    sendAuctionBtn.addEventListener("click", sendToAuction);

    removeBtn.removeEventListener("click", removeCard);
    removeBtn.addEventListener("click", removeCard);

    publishBtn.removeEventListener("click", publishItem);
    publishBtn.addEventListener("click", publishItem);

    editBtn.addEventListener("click", editCard);
    editBtn.addEventListener("click", editCard);

    function publishItem(e) {
      e.preventDefault();
      index = data.findIndex((item) => item.id == publishBtn.id);
      data[index].isPublished = !data[index].isPublished;
      saveData();
      renderCards(artistsItemsData, cardContainer);
    }

    function sendToAuction(e) {
      e.preventDefault();
      document.querySelector(".live-auctioning").style.display = "block";
      index = data.findIndex((item) => item.id == sendAuctionBtn.id);
      data[index].isAuctioning = true;
      saveData();
      renderCards(artistsItemsData, cardContainer);
    }

    function editCard(e) {
      e.preventDefault();
      index = data.findIndex((item) => item.id == editBtn.id);
      changePage(e);
      isEditing = true;
      isPublishedItem.checked = data[index].isPublished;
      itemTitle.value = data[index].title;
      itemDescription.value = data[index].description;
      itemType.value = data[index].type;
      itemPrice.value = data[index].price;
      itemImage.value = data[index].image;
    }
    function removeCard(e) {
      const modalConfirm = document.querySelector(".modal");
      const btnConfrim = document.querySelector(".btn-confirm");
      const btnCancel = document.querySelector(".btn-cancel");
      const btnClose = document.querySelector(".modal-header .btn-close");
      const itemsContainer = document.querySelector(".artist-items-container");
      modalConfirm.style.display = "block";
      itemsContainer.style.opacity = 0.4;
      e.preventDefault();
      index = data.findIndex((item) => item.id == removeBtn.id);
      btnConfrim.addEventListener("click", function () {
        data.splice(index, 1);
        artistsItemsData = data.filter((item) => item.artist == artistName);
        saveData();
        renderCards(artistsItemsData, cardContainer);
        modalConfirm.style.display = "none";
        itemsContainer.style.opacity = 1;
      });

      btnCancel.addEventListener("click", function () {
        modalConfirm.style.display = "none";
        itemsContainer.style.opacity = 1;
      });
      btnClose.addEventListener("click", function () {
        modalConfirm.style.display = "none";
        itemsContainer.style.opacity = 1;
      });
    }
  }

  function renderCards(array, container) {
    container.innerHTML = "";
    array.forEach((item) => {
      createCard(array, item);
    });
  }

  function writeDate(date) {
    let selectedDate = new Date(date);
    return `${selectedDate.getDate()}.${
      selectedDate.getMonth() + 1
    }.${selectedDate.getFullYear()}`;
  }

  function changePage(e) {
    e.preventDefault();
    isPublishedItem.checked = true;
    itemTitle.value = "";
    itemDescription.value = "";
    itemType.value = "";
    itemPrice.value = "";
    itemImage.value = "";
    let addItemModal = document.querySelector(".add-new-item-page");
    addItemModal.classList.toggle("d-none");
    cardContainer.classList.toggle("d-none");
    let snapshot = document.querySelector(".snapshot");
    snapshot.removeEventListener("click", startVideo);
    snapshot.addEventListener("click", startVideo);
    const img = document.querySelector(".capturedImage");
    img.src = "";
    let takesnapshot = document.querySelector(".takesnapshot");
    takesnapshot.classList.remove("d-none");
    document.querySelector("#itemImgUrl").value = "";
  }

  function startVideo() {
    let addItemModal = document.querySelector(".add-new-item-page");
    addItemModal.classList.add("d-none");

    let captureImagePage = document.querySelector("#capture-image-Popup");
    captureImagePage.classList.remove("d-none");
    captureImagePopup();
  }

  function captureImagePopup() {
    const screenShootBtn = document.querySelector(
      "#capture-image-Popup #camera-btn"
    );
    const selectVideos = document.querySelector("#capture-image-Popup #videos");

    screenShootBtn.removeEventListener("click", takePhoto);
    screenShootBtn.addEventListener("click", takePhoto);

    function takePhoto() {
      canvas.getContext("2d").drawImage(video, 0, 0);
      const imageURL = canvas.toDataURL("image/webp");
      img.src = imageURL;
      document.querySelector("#itemImgUrl").value = imageURL;
      let addItemModal = document.querySelector(".add-new-item-page");
      addItemModal.classList.remove("d-none");
      let captureImagePage = document.querySelector("#capture-image-Popup");
      captureImagePage.classList.add("d-none");
      let takesnapshot = document.querySelector(".takesnapshot");
      takesnapshot.classList.add("d-none");
      let capturedImage = document.querySelector(".capturedImage");
      capturedImage.removeEventListener("click", takePhoto);
      capturedImage.addEventListener("click", takePhoto);
    }

    function getStream() {
      const source = selectVideos.value;

      const constrains = {
        video: {
          deviceId: source ? { exact: source } : undefined,
        },
      };

      return navigator.mediaDevices.getUserMedia(constrains).then(gotStream);
    }

    function gotStream(stream) {
      video.srcObject = stream;
    }

    function getDevices() {
      return navigator.mediaDevices.enumerateDevices();
    }

    function gotDevices(deviceInfo) {
      const videoDevices = deviceInfo.filter((x) => x.kind === "videoinput");

      for (let i = 0; i < videoDevices.length; i++) {
        const device = videoDevices[i];

        const opt = document.createElement("option");
        opt.value = device.deviceId;
        opt.text = `Camera ${i + 1} ${device.label || device.deviceId}`;
        selectVideos.appendChild(opt);
      }
    }

    getStream().then(getDevices).then(gotDevices);
  }

  function stopVideo() {
    const stream = video.srcObject;
    if (stream) {
      const tracks = stream.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });

      video.srcObject = null;
    }
  }
}

function getData() {
  return JSON.parse(localStorage.getItem("items")) || data;
}

function saveData() {
  localStorage.setItem("items", JSON.stringify(data));
}
