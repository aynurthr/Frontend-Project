const NFT_API_URL = "http://localhost:3000/api/nfts";
const totalNFTCount = document.getElementById("total-nft-count");
const nftContainer = document.getElementById("container");
const collectionContainer = document.getElementsByClassName(
  "nft-container__collections"
)[0];
const loader = document.getElementById("loader");
const loadMoreButton = document.getElementById("load-more-btn");
const loadMoreButtonCollection = document.getElementById(
  "load-more-btn-collection"
);
const searchInput = document.getElementById("search-input");

let pageSize = 6;
let skip = 0;
let searchStr = "";

//bir nece request gonderende bize qayidan data(lar) qarismasin deye id
//yolundan istifade edirik. Eger id-ler ust-uste dusmurse,
//bu o demekdir ki, yeni request gonderilib, ve kohne requestin cavabi
//artiq lazim deyil, ve hemin kohne datani artiq container e doldurmuruq.
let currentSearchId = 0;

function getTotalNumberOfFavoriteNfts() {
  const favoriteNfts = JSON.parse(localStorage.getItem("favoriteNfts")) || [];
  let totalNfts = 0;

  favoriteNfts.forEach((artist) => {
    totalNfts += artist[1].length;
  });

  console.log(totalNfts);
  return totalNfts;
}

function fetchNFTs() {
  const currentSearch = currentSearchId;
  showLoader();
  fetch(NFT_API_URL, {
    method: "POST",
    headers: {
      "CONTENT-TYPE": "application/json",
    },
    body: JSON.stringify({
      skip: skip,
      pageSize: pageSize,
      searchStr: searchStr,
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (currentSearch === currentSearchId) {
        totalNFTCount.innerHTML = data.totalCount;
        if (data.totalCount == 0) {
          const emptyDivElement = document.createElement("div");
          emptyDivElement.classList.add("nft-container__empty");
          emptyDivElement.innerHTML = `<h2>Oops! No Matching NFTs Found!</h2>`;
          emptyDivElement.style.display = "flex";
          emptyDivElement.style.gridColumn = "span 3";
          nftContainer.appendChild(emptyDivElement);
        } else {
          renderNFTs(data.nfts, nftContainer);
          skip += pageSize;
        }

        if (!data.hasMore) {
          hideLoader();
          loadMoreButton.style.display = "none";
        } else {
          loadMoreButton.style.display = "block";
        }
      }
    });
}

let timeoutId = 0;
searchInput.addEventListener("keyup", function (event) {
  currentSearchId++;
  const currentSearch = currentSearchId;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (currentSearch === currentSearchId) {
      searchStr = event.target.value;
      skip = 0;
      nftContainer.innerHTML = "";
      loadMoreButton.style.display = "none";
      fetchNFTs();
    }
  }, 300);
});

function renderNFTs(nfts, container) {
  nfts.forEach((nft) => {
    const nftElement = document.createElement("div");
    nftElement.classList.add("nft-container__nft");

    nftElement.innerHTML = `
    <div id="heart-icon">
    <img
      src="../../media/icons/heart.svg"
      alt="heart icon"
    />
  </div>
        <img src="../../../${nft.imgPath}" alt="${nft.name}" />
        <div class="nft-container__nft__text">
          <h5>${nft.name}</h5>
          <div class="nft-container__nft__text__artist">
            <img src="../../../${nft.creator.profileImgPath}" alt=${nft.creator.name} />
            <span>${nft.creator.name}</span>
          </div>
          <div class="nft-container__nft__text__details">
            <div class="nft-container__nft__text__details__price">
              <h5>Price</h5>
              <p>${nft.price.value} ${nft.price.currency}</p>
            </div>
            <div class="nft-container__nft__text__details__bid">
              <h5>Highest Bid</h5>
              <p>${nft.highestBid.value} ${nft.highestBid.currency}</p>
            </div>
          </div>
        </div>
      `;
    const heartIcon = nftElement.querySelector("#heart-icon");
    const favoriteNfts = JSON.parse(localStorage.getItem("favoriteNfts")) || [];
    const isFavorite = checkIfFavorite(nft.name, nft.creator.name);
    updateHeartIcon(heartIcon, isFavorite);
    heartIcon.addEventListener("click", () => {
      handleHeartIconClick(nft.name, nft.creator.name);
      const favoriteNfts =
        JSON.parse(localStorage.getItem("favoriteNfts")) || [];
      const isFavorite = checkIfFavorite(nft.name, nft.creator.name);
      updateHeartIcon(heartIcon, isFavorite);
    });
    container.appendChild(nftElement);
  });
}

function onVisible(element, callback) {
  new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        callback(element);
      }
    });
  }).observe(element);
  if (!callback) return new Promise((r) => (callback = r));
}

collectionContainer.style.display = "none"; //when the page loads for the first time
onVisible(loadMoreButton, () => {
  loadMoreButton.style.display = "none";
  fetchNFTs();
});

//Favourites:
let currentCollectionNftIdx = 0;
let isFetchingCollectionNfts = false;

onVisible(loadMoreButtonCollection, async () => {
  const favoriteNfts = JSON.parse(localStorage.getItem("favoriteNfts")) || [];
  if (
    getTotalNumberOfFavoriteNfts() !== 0 &&
    currentCollectionNftIdx < getTotalNumberOfFavoriteNfts()
  ) {
    loadMoreButtonCollection.style.display = "none";
    await fetchCollectionNFTs(favoriteNfts);
  }
});

async function updateCollectionsContainer() {
  const flatFavoriteNfts = flattenFavoriteNfts(); //[a,b,c,d] kimi array verecek
  collectionContainer.innerHTML = "";

  if (!isFetchingCollectionNfts) {
    isFetchingCollectionNfts = true;
    collectionBtn.disabled = true;
    currentCollectionNftIdx = 0;
    currentCollectionNftIdx = await fetchCollectionNFTs(
      flatFavoriteNfts,
      currentCollectionNftIdx
    );
    isFetchingCollectionNfts = false;
    collectionBtn.disabled = false;
  }
}

async function fetchCollectionNFTs(flatFavoriteNfts, startIndex) {
  let localIndex = startIndex;

  while (localIndex < getTotalNumberOfFavoriteNfts()) {
    showLoader();

    //burda iki reqem arasinda en kicik olani secib end pointi o reqem qoyuruq
    const endIndex = Math.min(localIndex + 6, getTotalNumberOfFavoriteNfts());

    //6 nft adi secirik local storageden
    const batch = flatFavoriteNfts.slice(localIndex, endIndex);
    console.log(batch);

    //burdan nft-leri fetch edirik, amma qaytarilan array-de ancaq promiseler olacaq, hele ki
    const responses = await Promise.all(
      batch.map(async (currentSearch) => {
        return fetch(NFT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pageSize: 1,
            searchStr: currentSearch,
          }),
        });
      })
    );

    //bize qaytarilan promise-leri bir-bir await edirik
    const nftsData = await Promise.all(
      responses.map((response) => response.json())
    );

    //her birinin cardini yaradib container e elave edirik
    nftsData.forEach((data) => {
      renderNFTs(data.nfts, collectionContainer);
    });

    hideLoader();
    localIndex += 6;

    //eger hele de container e elave olunmamis collection nft qalibsa,
    //loadMoreBtn i gizledir, eks halda visible edir
    if (localIndex >= getTotalNumberOfFavoriteNfts()) {
      loadMoreButtonCollection.style.display = "none";
    } else {
      loadMoreButtonCollection.style.display = "block";
    }
  }
}

function handleHeartIconClick(nftName, artistName) {
  const favoriteNfts = JSON.parse(localStorage.getItem("favoriteNfts")) || [];
  let artist = favoriteNfts.find((entry) => entry[0] === artistName);
  if (artist) {
    const nftIndex = artist[1].indexOf(nftName);
    if (nftIndex !== -1) {
      artist[1].splice(nftIndex, 1);
      if (artist[1].length === 0) {
        favoriteNfts.splice(favoriteNfts.indexOf(artist), 1);
      }
    } else {
      artist[1].push(nftName);
    }
  } else {
    favoriteNfts.push([artistName, [nftName]]);
  }

  localStorage.setItem("favoriteNfts", JSON.stringify(favoriteNfts));
  updateCollectionNumber();

  const nftContainer = document.getElementById("container");
  const nftElement = Array.from(
    nftContainer.getElementsByClassName("nft-container__nft")
  ).find((nft) => {
    const nftTitle = nft.querySelector(
      ".nft-container__nft__text h5"
    ).innerText;
    return nftTitle === nftName;
  });

  if (nftElement) {
    const heartIcon = nftElement.querySelector("#heart-icon");
    const isFavorite = checkIfFavorite(nftName, artistName);
    updateHeartIcon(heartIcon, isFavorite);
  }
}

function updateHeartIcon(heartIcon, isFavorite) {
  const heartImg = heartIcon.querySelector("img");
  heartImg.src = isFavorite
    ? "../../media/icons/heart-filled.svg"
    : "../../media/icons/heart.svg";
}
function checkIfFavorite(nftName, artistName) {
  const favoriteNfts = JSON.parse(localStorage.getItem("favoriteNfts")) || [];
  const artist = favoriteNfts.find((entry) => entry[0] === artistName);

  return artist ? artist[1].includes(nftName) : false;
}

function updateCollectionNumber() {
  document.querySelector("#collection-button div").innerHTML =
    getTotalNumberOfFavoriteNfts();
}
updateCollectionNumber(); //ilk basda update edirik

//flatten edende arrayde sadece nft adlari saxlanilacaq
//bu collection container-ini doldurmaq ucundu
function flattenFavoriteNfts() {
  const favoriteNfts = JSON.parse(localStorage.getItem("favoriteNfts")) || [];
  return favoriteNfts.flatMap((artistEntry) => artistEntry[1]);
}

//For tab buttons:
const nftsBtn = document.getElementById("nfts-button");
const collectionBtn = document.getElementById("collection-button");
const nftCardsContainer = document.querySelector(".nft-container .container");

function btnClick(button) {
  nftsBtn.classList.remove("clicked-on");
  collectionBtn.classList.remove("clicked-on");
  button.classList.add("clicked-on");
}

nftsBtn.addEventListener("click", () => {
  btnClick(nftsBtn);
  collectionContainer.style.display = "none";
  if (nftCardsContainer.childElementCount > 0) {
    //checks whether there are any nfts in the container
    nftCardsContainer.style.display = "grid";
    document.querySelector(".nft-container__empty").style.display = "none";
  } else {
    document.querySelector(".nft-container__empty").style.display = "initial";
  }
});

collectionBtn.addEventListener("click", () => {
  btnClick(collectionBtn);
  nftCardsContainer.style.display = "none";
  const favoriteNfts = JSON.parse(localStorage.getItem("favoriteNfts")) || [];
  if (getTotalNumberOfFavoriteNfts() > 0) {
    //checks whether there are any nfts in the container
    updateCollectionsContainer();
    collectionContainer.style.display = "grid";
    document.querySelector(".nft-container__empty").style.display = "none";
  } else {
    loadMoreButtonCollection.style.display = "none";
    hideLoader();
    collectionContainer.style.display = "none";
    document.querySelector(".nft-container__empty").style.display = "initial";
  }
});

btnClick(nftsBtn);

function showLoader() {
  loader.style.display = "flex";
}
function hideLoader() {
  loader.style.display = "none";
}
