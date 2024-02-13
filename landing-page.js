let artistUserName = document.querySelector("#users-name");
function initLandingPage() {
  artistUserName.addEventListener("change", (e) => {
    localStorage.setItem("currentArtist", `${artistUserName.value}`);
    artistName = localStorage.getItem("currentArtist");
    joinAsArtist(artistName, artistUserName);
  });

  function fetchUsers() {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        artistUserName.innerHTML = "";
        const username = new Option("Choose", "");
        artistUserName.appendChild(username);

        data.forEach((user) => {
          let username = document.createElement("option");
          username.innerText = `${user.name}`;
          username.setAttribute("value", `${user.name}`);
          artistUserName.appendChild(username);
        });
      });
  }
  fetchUsers();
}
