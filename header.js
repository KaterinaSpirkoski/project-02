const navText = document.querySelector(".logo-text");
const navLogo = document.querySelector(".logo-img");
const auctionBtn = document.querySelector(".auction-btn");
const header = document.querySelector("#header");
const headerInner = document.querySelector(".header-inner");
const logoBrand = document.querySelector(".logo-brand");
const navBarToggle = document.querySelector(".navbar-toggler");
const navBarCollapse = document.querySelector(".navbar-collapse");
const bgLogo = document.querySelector(".logo-img");

function updateHeader() {
  const hash = window.location.hash;

  if (hash === "#artists" || hash === "#artist-items") {
    logoBrand.style.display = "none";
    headerInner.style.display = "flex";
    headerInner.style.justifyContent = "space-between";
    auctionBtn.style.display = "none";
    navText.innerText = `${artistName}`;
    navBarToggle.style.display = "block";
    navLogo.style.display = "block";
  } else if (
    hash === "#visitors" ||
    hash === "#visitors-listing" ||
    hash === "#auction"
  ) {
    logoBrand.style.display = "none";
    headerInner.style.display = "flex";
    headerInner.style.justifyContent = "space-between";
    auctionBtn.style.display = "block";
    navText.innerText = "Street ARTists";
    navBarCollapse.style.display = "none";
    navBarToggle.style.display = "none";
    navLogo.style.display = "block";
  } else {
    headerInner.display = "flex";
    headerInner.style.justifyContent = "center";
    navBarToggle.style.display = "none";
    logoBrand.display = "flex";
    navText.innerText = "Street ARTists";
    navLogo.style.display = "none";
    auctionBtn.style.display = "none";
  }

  if (hash === "#artist-items" || hash === "#auction") {
    navBarCollapse.style.zIndex = "222";
    bgLogo.style.zIndex = "888";
  }
}
window.addEventListener("load", updateHeader);
window.addEventListener("hashchange", updateHeader);
