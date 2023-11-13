//For Timer
//November 20, 2023, at 00:00:00
var date = new Date(Date.UTC(2023, 10, 20, 0, 0, 0));
date.setHours(date.getHours() - 4); //GMT+4

function updateTimer() {
  var now = new Date().getTime();
  var remainingTime = date - now;

  if (remainingTime <= 0) {
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
  } else {
    var hours = Math.floor(remainingTime / (1000 * 60 * 60));
    var minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    document.getElementById("hours").textContent =
      hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").textContent =
      minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").textContent =
      seconds < 10 ? "0" + seconds : seconds;
  }
}

setInterval(updateTimer, 1000);

//API part:

const API_BASE_URL = "http://localhost:3000/api/creators";
const artistsContainer = document.querySelector(".top-artists__artists");
const loadingElement = document.querySelector(".loader");
loadingElement.style.display = "none";

function getData() {
  loadingElement.style.display = "grid";
  fetch(API_BASE_URL)
    .then((res) => {
      if (res.status !== 200) {
      }
      return res.json();
    })
    .then((data) => {
      let artists = data;
      artists.forEach((artist, idx) => {
        createArtistBox(artist, artistsContainer);
        newArtist = document.querySelectorAll(".top-artists__artists__artist")[
          idx
        ];
        newArtist.addEventListener("click", () => {
          window.open(
            `../../../client/pages/artist/index.html?artist_id=${artist.id}`,
            "_self"
          );
        });
      });
    })
    .catch((err) => {
      const errorMessage = `
      <div class="top-artists__artists__bad-request">
      <img src="../../media/icons/sad-face.svg" alt="sad face icon" />
        <p>Sorry, we are experiencing technical difficulties with our API server. Please check back later.</p>
      </div>`;
      document.querySelector(".top-artists__artists").innerHTML = errorMessage;
      document.querySelector(".top-artists__mobile-btn").style.display = "none";
      document.querySelector(".top-artists__header a").style.display = "none";
      document.querySelector(".top-artists__artists").style.display = "initial";
    })
    .finally(() => {
      loadingElement.style.display = "none";
    });
}

getData();

function createArtistBox(artist, artistsContainer) {
  const artistContainer = document.createElement("div");
  artistContainer.classList.add("top-artists__artists__artist");

  const topPart = document.createElement("div");
  topPart.classList.add("top-artists__artists__artist__top");

  const artistId = document.createElement("div");
  artistId.textContent = artist.id;

  const artistAvatar = document.createElement("img");
  artistAvatar.src = `../../../${artist.profileImgPath}`;
  artistAvatar.alt = artist.name;

  topPart.appendChild(artistId);
  topPart.appendChild(artistAvatar);

  const bottomPart = document.createElement("div");
  bottomPart.classList.add("top-artists__artists__artist__bottom");

  const artistName = document.createElement("h5");
  artistName.textContent = artist.name;

  const totalSales = document.createElement("div");
  totalSales.innerHTML = `<p>Total Sales:</p>
    <p class="top-artists__artists__artist__bottom__sales">${artist.totalSale.value} ${artist.totalSale.currency}</p>`;

  bottomPart.appendChild(artistName);
  bottomPart.appendChild(totalSales);

  artistContainer.appendChild(topPart);
  artistContainer.appendChild(bottomPart);

  artistsContainer.appendChild(artistContainer);
}

document
  .querySelector(".NFT-info__left__artist")
  .addEventListener("click", () => {
    const artistId = 7;
    const url = `http://127.0.0.1:5500/client/pages/artist/index.html?artist_id=${artistId}`;
    window.open(url, "_self");
  });
