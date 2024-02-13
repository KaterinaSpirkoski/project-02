function initVisitorsListingPage() {
  updateHeader();
}
function visitorListingPage() {
  const cardContainer = document.querySelector(
    "#visitors-listing .card-container"
  );
  const btnFilter = document.querySelector(".btn-filter");
  const btnClose = document.querySelector(".filters-container .btn-close-img");
  const btnApply = document.querySelector(".btn-apply");
  const filterPage = document.querySelector(".filters-container");
  const byTitleInput = document.querySelector("#by-title");
  const byArtistInput = document.querySelector("#by-artist");
  const minPriceInput = document.querySelector("#by-minPrice");
  const maxPriceInput = document.querySelector("#by-MaxPrice");
  const byTypeInput = document.querySelector("#by-type");

  function createCards(array) {
    cardContainer.innerHTML = "";

    array.forEach((item, idx) => {
      const cardInner = document.createElement("div");
      cardInner.classList.add("card-inner", idx % 2 === 0 ? "light" : "dark");

      const cardImg = document.createElement("div");
      cardImg.innerHTML = `<img src="${item.image}" alt="">`;
      cardImg.classList.add("card-img");

      const cardHeader = document.createElement("div");
      cardHeader.classList.add("card-header-title");
      cardHeader.innerHTML = `
      <div class="left">
        <h3 class="artist-name">${item.artist}</h3>
      </div>
      <div class="right">
        <span class="price">$${item.price}</span>
      </div>
    `;

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
      cardBody.innerHTML = `<p class="title-item">${item.title}</p>
      <p>${item.description}</p>`;

      cardInner.append(cardImg, cardHeader, cardBody);
      cardContainer.appendChild(cardInner);
    });
  }

  btnFilter.addEventListener("click", function () {
    filterPage.classList.remove("d-none");
    cardContainer.classList.add("d-none");
  });

  btnClose.addEventListener("click", function () {
    filterPage.classList.add("d-none");
    cardContainer.classList.remove("d-none");
  });

  function filteringItemsCard() {
    const byTitle = byTitleInput.value;
    const byArtist = byArtistInput.value;
    const byMinPrice = parseFloat(minPriceInput.value);
    const byMaxPrice = parseFloat(maxPriceInput.value);
    const byType = byTypeInput.value;

    return publishedItems.filter(
      (item) =>
        (!byTitle || item.title.includes(byTitle)) &&
        (!byArtist || item.artist === byArtist) &&
        (!byMinPrice || item.price >= byMinPrice) &&
        (!byMaxPrice || item.price <= byMaxPrice) &&
        (!byType || item.type === byType)
    );
  }

  btnApply.addEventListener("click", function () {
    const filteredItems = filteringItemsCard();
    createCards(filteredItems);
    filterPage.classList.add("d-none");
    cardContainer.classList.remove("d-none");
  });

  const publishedItems = data.filter((item) => item.isPublished);
  createCards(publishedItems);

  createUsersAndTypes();
  function createUsersAndTypes() {
    const byArtistSelect = document.querySelector("#by-artist");
    const byTypeSelect = document.querySelector("#by-type");
    byArtistSelect.innerHTML = "";
    byTypeSelect.innerHTML = "";

    const chooseTypeOption = document.createElement("option");
    chooseTypeOption.value = "";
    chooseTypeOption.innerText = "Choose";
    byTypeSelect.appendChild(chooseTypeOption);

    itemTypes.forEach((type) => {
      const optionType = document.createElement("option");
      optionType.value = type;
      optionType.text = type;
      byTypeSelect.appendChild(optionType);
    });

    const chooseArtistOption = document.createElement("option");
    chooseArtistOption.value = "";
    chooseArtistOption.innerText = "Choose";
    byArtistSelect.appendChild(chooseArtistOption);

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((user) => {
          const optionArtist = document.createElement("option");
          optionArtist.value = user.name;
          optionArtist.text = user.name;
          byArtistSelect.appendChild(optionArtist);
        });
      });
  }
}
