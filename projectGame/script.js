// import { DOMSelection } from "./domSelection.js";

const player = document.querySelectorAll(".player");
const playerMain = document.querySelector(".player__main");
const player1 = document.querySelector(".player1");
const player2 = document.querySelector(".player2");
const player3 = document.querySelector(".player3");
const playerOverlayMain = document.querySelector(".player__overlay__main");
const playerOverlay1 = document.querySelector(".player__overlay1");
const playerOverlay2 = document.querySelector(".player__overlay2");
const playerOverlay3 = document.querySelector(".player__overlay3");
const btnInfo = document.querySelectorAll(".btn__info");
const countryInfo = document.querySelector(".country__info");

// *** TOOL ***
const btnTool = document.querySelector(".btn__tool");
const toolItem = document.querySelectorAll(".tool__item");

const createCountryHTML = function (data, country = "", player, playerOverlay) {
  console.log(data);
  const htmlImg = `        
        <img class="country__img" src="${data.flag}" />`;

  const htmlCountryName = `<p class = "country__name">${data.name}</p>`;

  playerOverlay.insertAdjacentHTML("afterbegin", htmlCountryName);
  player.insertAdjacentHTML("beforeend", htmlImg);
};

async function getCountry(countryName, player, playerOverlay) {
  const res = await fetch(
    `https://restcountries.eu/rest/v2/name/${countryName}`
  );
  const [countryData] = await res.json();

  createCountryHTML(countryData, countryName, player, playerOverlay);
}
getCountry("Taiwan", playerMain, playerOverlayMain);
getCountry("Japan", player1, playerOverlay1);
getCountry("Indonesia", player2, playerOverlay2);
getCountry("France", player3, playerOverlay3);

// btnInfo.forEach(function (btn) {
//   btn.addEventListener("click", function () {
//     btnInfo.textcontent = "close";
//   });
// });

let firstTime = true;
btnTool.addEventListener("click", function toolTogle() {
  if (firstTime) {
    showTool();
    firstTime = false;
  } else {
    hideTool();
    firstTime = true;
  }
});

function showTool() {
  document.querySelector(".tool__container").classList.remove("hiddenDisplay");

  toolItem.forEach(function rmToolItemHidden(element) {
    element.classList.remove("hiddenDisplay");
  });

  setTimeout(() => {
    document.querySelector(".tool__container").style.height = "20rem";

    document.querySelector(".tool__container").classList.remove("hidden");
  }, 10);

  setTimeout(() => {
    toolItem.forEach(function rmToolItemHidden(element) {
      element.classList.remove("hidden");
    });
  }, 500);

  // document.querySelector(".tool__container").style.bottom = "3rem";
}

function hideTool() {
  document.querySelector(".tool__container").style.height = "0";

  document.querySelector(".tool__container").classList.add("hidden");

  toolItem.forEach(function rmToolItemHidden(element) {
    element.classList.add("hidden");
  });

  setTimeout(() => {}, 500);

  // document.querySelector(".tool__container").style.bottom = "0";
}

// let firstTime = true;
btnInfo.forEach(function (btn) {
  btn.addEventListener("click", function () {
    showCountryInfo();
  });
});

function showCountryInfo() {
  document.querySelector(".country__info").classList.remove("hiddenDisplay");

  setTimeout(() => {
    document.querySelector(".country__info").classList.remove("hidden");
    // document.querySelector(".country__info").classList.remove("widthTest");
  }, 100);
}

document
  .querySelector(".btn__country__info__close")
  .addEventListener("click", function () {
    document.querySelector(".country__info").classList.add("hiddenDisplay");

    setTimeout(() => {
      document.querySelector(".country__info").classList.add("hidden");
      // document.querySelector(".country__info").classList.add("widthTest");
    }, 100);
  });
