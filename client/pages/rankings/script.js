//For tab buttons:
const todayBtn = document.getElementById("today-button");
const thisWeekBtn = document.getElementById("this-week-button");
const thisMonthBtn = document.getElementById("this-month-button");
const allTimeBtn = document.getElementById("all-time-button");

function btnClick(button) {
  todayBtn.classList.remove("clicked-on");
  thisWeekBtn.classList.remove("clicked-on");
  thisMonthBtn.classList.remove("clicked-on");
  allTimeBtn.classList.remove("clicked-on");
  button.classList.add("clicked-on");
}

todayBtn.addEventListener("click", () => {
  btnClick(todayBtn);
});
thisWeekBtn.addEventListener("click", () => {
  btnClick(thisWeekBtn);
});
thisMonthBtn.addEventListener("click", () => {
  btnClick(thisMonthBtn);
});
allTimeBtn.addEventListener("click", () => {
  btnClick(allTimeBtn);
});

btnClick(todayBtn);

//API part:

const API_BASE_URL = "http://localhost:3000/api/creators";
const artistsContainer = document.querySelector(".artists__container");
// const loadingElement = document.querySelector(".loader");
// loadingElement.style.display = "none";

function getData() {
  // loadingElement.style.display = "flex";
  fetch(API_BASE_URL)
    .then((res) => {
      if (res.status !== 200) {
      }
      return res.json();
    })
    .then((data) => {
      let artists = data;
      artists.forEach((artist) => {
        createArtistBox(artist, artistsContainer);
        newArtist = document.querySelectorAll(".artists__container__artist")[
          artist.id - 1
        ];
        newArtist.addEventListener("click", () => {
          window.open(
            `http://127.0.0.1:5500/client/pages/artist/index.html?artist_id=${artist.id}`,
            "_self"
          );
        });
      });
    });
  // .catch((err) => {
  //   console.log("err", err);
  //   const errorMessage = `
  //   <div class="top-artists__artists__bad-request">
  //   <img src="../../media/icons/sad-face.svg" alt="sad face icon" />
  //     <p>Sorry, we are experiencing technical difficulties with our API server. Please check back later.</p>
  //   </div>`;
  //   document.querySelector(".top-artists__artists").innerHTML = errorMessage;
  //   document.querySelector(".top-artists__mobile-btn").style.display = "none";
  //   document.querySelector(".top-artists__header a").style.display = "none";
  //   document.querySelector(".top-artists__artists").style.display = "initial";
  // })
  // .finally(() => {
  //   loadingElement.style.display = "none";
  // });
}

getData();

function createArtistBox(artist, artistsContainer) {
  const artistContainer = document.createElement("div");
  artistContainer.classList.add("artists__container__artist");

  artistContainer.innerHTML = `<div class="artists__container__artist__rank-artist">
  <div class="artists__container__artist__rank-artist__rank">${artist.id}</div>
  <div class="artists__container__artist__rank-artist__artist">
    <img
      src="../../../${artist.profileImgPath}"
      alt="${artist.name} avatar"
    />
    <h5>${artist.name}</h5>
  </div>
</div>
<div class="artists__container__artist__stats">
  <p>+${artist.totalSale.value}%</p>
  <p>${artist.nftSold}</p>
  <p>${artist.volume.substring(0, artist.volume.length - 3)}k</p>
  <div>
    <img
      src="../../media/icons/trash-bin.svg"
      alt="trash bin icon"
    />
  </div>
</div>`;

  artistsContainer.appendChild(artistContainer);
}
