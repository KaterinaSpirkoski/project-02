let artistName;
function handleRoute(e) {
  let data;
  if (localStorage.getItem("items")) {
    data = JSON.parse(localStorage.getItem("items"));
  } else {
    localStorage.setItem("items", JSON.stringify(items));
    data = JSON.parse(localStorage.getItem("items"));
  }
  if (localStorage.getItem("currentArtist")) {
    artistName = localStorage.getItem("currentArtist");
  }
  e.preventDefault();
  const hash = location.hash;

  const allSections = document.querySelectorAll("section");
  allSections.forEach((el) => (el.style.display = "none"));

  if (hash) {
    document.querySelector(hash).style.display = "block";
  }

  switch (hash) {
    case "#landing-page":
      initLandingPage();
      userIsVisitor = null;
      break;
    case "#artists":
      initArtistsPage(artistName);
      displayIncomes(artistName);
      createChart();
      localStorage.setItem("userType", "artist");
      break;
    case "#artist-items":
      initArtistsItemsPage();
      artistItemsPage();
      localStorage.setItem("userType", "artist");
      break;
    case "#visitors":
      initVisitorsPage();
      initVisitorGallery();
      localStorage.setItem("userType", "visitor");
      break;
    case "#visitors-listing":
      initVisitorsListingPage();
      visitorListingPage();
      localStorage.setItem("userType", "visitor");
      break;
    case "#auction":
      initAuctionPage();
      break;
    default:
      location.hash = "#landing-page";
  }
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

function joinAsArtist(currentArtist, list) {
  currentArtist = list.value;
  if (list.value !== "") {
    location.hash = "#artists";

    let logoText = document.querySelector(".logo-text");
    logoText.innerText = `${currentArtist}`;
  }
}
