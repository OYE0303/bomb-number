import {
  page,
  userName,
  btnShowLevel,
  popupLevelWord,
  rangeNumberMax,
  remaingCounts,
  btnInfo,
  playerMain,
  playerOverlayMain,
  player1,
  playerOverlay1,
  player2,
  playerOverlay2,
  player3,
  playerOverlay3,
  playerComputer,
} from "./../selector/selector.js";
import wait from "../utils/wait.js";
import showErrorModal from "../utils/showErrorModal.js";
import createTargetNumber from "../utils/createTargetNumber.js";
import globalVariable from "../globalVariable/globalVariable.js";
import createRandomNumber from "../utils/createRandomNumber.js";
import userTurn from "../order/userTurn.js";
import { showGuessInput } from "./../guessNumber/guessInput.js";

function showContent() {
  setAllCountentDataAndUI();

  // show all content
  page.forEach((page) => page.classList.remove("hidden--display"));
  wait(0).then(() => {
    page.forEach((page) => page.classList.remove("hidden--opacity"));
  });
}

export default showContent;

async function setAllCountentDataAndUI() {
  // set userName on UI
  userName.textContent = globalVariable.userName;

  // set level on UI
  btnShowLevel.textContent = globalVariable.level;
  popupLevelWord.textContent = globalVariable.level;

  // set max number on UI
  rangeNumberMax.textContent = globalVariable.maxNumber;

  // show country image and name on UI
  try {
    await showUserCountryImg();
  } catch (err) {
    showErrorModal();
  }
  try {
    await showComputerCountryImg();
  } catch (err) {
    showErrorModal();
  }

  // show remaining counts of tool
  remaingCounts.forEach(
    (count) => (count.textContent = globalVariable.userCountryInfo.toolCounts)
  );

  // set target number
  createTargetNumber();

  // user turn
  userTurn(true);

  // show guess input
  showGuessInput();

  // show info button
  btnInfo.forEach((btn) => btn.classList.remove("hidden--display"));
}

async function showUserCountryImg() {
  showMainContentLoading(playerMain, "main");

  const countryName = globalVariable.userCountryInfo.countryName;
  let countryData;
  try {
    countryData = await getOneCountryData(countryName);
  } catch (err) {
    showErrorModal();
  }

  // set user country info
  globalVariable.userCountryInfo.order = 0;
  globalVariable.userCountryInfo.countryData = countryData;

  createCountryHTMLAndShowUI(countryData, playerMain, playerOverlayMain);

  removeMainContentLoading(playerMain, "main");
}

async function showComputerCountryImg() {
  showMainContentLoading(null, null, true);

  let randomCountryNameArr;
  try {
    randomCountryNameArr = await randomlyChooseCountryName();
  } catch (err) {
    showErrorModal();
  }

  for (let i = 0; i < randomCountryNameArr.length; i++) {
    const countryData = randomCountryNameArr[i];

    // set computer country data, and show img UI
    switch (i) {
      case 0:
        {
          setCountryInfo(
            globalVariable.Computer1CountryInfo,
            1,
            3,
            countryData,
            "left"
          );

          createCountryHTMLAndShowUI(countryData, player1, playerOverlay1);

          removeMainContentLoading(player1, i);
        }
        break;

      case 1:
        {
          setCountryInfo(
            globalVariable.Computer2CountryInfo,
            2,
            3,
            countryData,
            "top"
          );

          createCountryHTMLAndShowUI(countryData, player2, playerOverlay2);

          removeMainContentLoading(player2, i);
        }
        break;

      case 2:
        {
          setCountryInfo(
            globalVariable.Computer3CountryInfo,
            3,
            3,
            countryData,
            "right"
          );

          createCountryHTMLAndShowUI(countryData, player3, playerOverlay3);

          removeMainContentLoading(player3, i);
        }
        break;

      default:
        break;
    }
  }
}

function createCountryHTMLAndShowUI(data, player, playerOverlay) {
  const countryName = data.name.common;

  let htmlCountryName;

  // resize the name of country
  if (countryName.length >= 40)
    htmlCountryName = `<p class = "country__name font1">${countryName}</p>`;
  else if (countryName.length >= 30 && countryName.length < 40)
    htmlCountryName = `<p class = "country__name font1.5">${countryName}</p>`;
  else if (countryName.length >= 20 && countryName.length < 30)
    htmlCountryName = `<p class = "country__name font2">${countryName}</p>`;
  else if (countryName.length >= 10 && countryName.length < 20)
    htmlCountryName = `<p class = "country__name font3">${countryName}</p>`;
  else htmlCountryName = `<p class = "country__name font4">${countryName}</p>`;

  const htmlImg = `        
          <img class="country__img" src="${data.flags.svg}" alt="${countryName} flag" />`;

  playerOverlay.insertAdjacentHTML("afterbegin", htmlCountryName);
  player.insertAdjacentHTML("beforeend", htmlImg);
}

async function getOneCountryData(countryName) {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    if (res.status !== 200) {
      throw new Error();
    }

    const [data] = await res.json();

    if (!data) {
      throw new Error();
    }

    return data;
  } catch (err) {
    showErrorModal();
  }
}

async function randomlyChooseCountryName() {
  if (!globalVariable.cacheAllCountryData) {
    try {
      const res = await fetch("https://restcountries.com/v3.1/all");

      if (res.status !== 200) {
        throw new Error();
      }

      const data = await res.json();

      if (!data) {
        throw new Error();
      }

      globalVariable.cacheAllCountryData = data;
    } catch (err) {
      showErrorModal();
    }
  }

  const countryNameArr = [];
  let i = 0;
  while (i < 3) {
    const randomNum = createRandomNumber(
      0,
      globalVariable.cacheAllCountryData.length - 1
    );

    // note that countryName is an object
    const {
      name: { common: countryName },
    } = globalVariable.cacheAllCountryData[randomNum];

    // check random country is not duplicate, and not as same as user's country
    if (
      !countryNameArr.find(
        (countryObj) => countryObj.name.common === countryName
      ) &&
      globalVariable.userCountryInfo.countryName !== countryName &&
      countryName
    ) {
      // store entire country object
      countryNameArr.push(globalVariable.cacheAllCountryData[randomNum]);

      // nice!!!
      // set globalVariable.countryInfo in order
      globalVariable.Computer1CountryInfo.countryName
        ? globalVariable.Computer2CountryInfo.countryName
          ? (globalVariable.Computer3CountryInfo.countryName = countryName)
          : (globalVariable.Computer2CountryInfo.countryName = countryName)
        : (globalVariable.Computer1CountryInfo.countryName = countryName);

      i++;
    }
  }

  return countryNameArr;
}

function showMainContentLoading(player, argIndex, computer = false) {
  // set loading on computer player
  if (computer) {
    playerComputer.forEach((computer, index) =>
      computer.insertAdjacentHTML(
        "beforeend",
        `<div class="content__loading content__loading--${index}"></div>`
      )
    );
  }
  // set loading on main player
  else {
    player.insertAdjacentHTML(
      "beforeend",
      `<div class="content__loading content__loading--${argIndex}"></div>`
    );
  }
}

function removeMainContentLoading(player, index) {
  player.removeChild(document.querySelector(`.content__loading--${index}`));
}

function setCountryInfo(player, order, toolCounts, data, position) {
  player.order = order;
  player.toolCounts = toolCounts;
  player.countryData = data;
  player.position = position;
}
