import {
  countryInfo as countryInfoDOM,
  info,
  btnInfo,
  btnCountryInfoClose,
} from "./../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import wait from "../utils/wait.js";
function countryInfo() {
  btnCountryInfoClose.addEventListener("click", closeCountryInfo);
  btnInfo.forEach((btn) => btn.addEventListener("click", showCountryInfo));
}

export default countryInfo;

function showCountryInfo(e) {
  chooseCountryInfo(Number(e.target.dataset.id));

  countryInfoDOM.classList.remove("hidden--display");

  wait(0).then(() => countryInfoDOM.classList.remove("hidden--opacity"));
}

function closeCountryInfo() {
  info.classList.add("hidden--display");

  wait(0).then(() => info.classList.add("hidden--opacity"));
}

function chooseCountryInfo(order) {
  const countryName = globalVariable.allPlayerArrNoChange[order].countryName;
  const contryElement = document.querySelector(".info__name");

  // resize font size
  if (countryName.length >= 30) contryElement.style.fontSize = "2rem";
  else if (countryName.length >= 20 && countryName.length < 30)
    contryElement.style.fontSize = "3rem";
  else if (countryName.length >= 10 && countryName.length < 20)
    contryElement.style.fontSize = "4rem";
  else contryElement.style.fontSize = "5rem";
  contryElement.textContent =
    globalVariable.allPlayerArrNoChange[order].countryName;

  // manually set country info
  document.querySelector(".info__region").textContent =
    globalVariable.allPlayerArrNoChange[order].countryData?.region ||
    "NO PROVIDED";
  document.querySelector(".info__capital").textContent =
    globalVariable.allPlayerArrNoChange[order].countryData?.capital[0] ||
    "NO PROVIDED";
  document.querySelector(".info__area").textContent =
    convertNumberToString(
      globalVariable.allPlayerArrNoChange[order].countryData?.area
    ) || "NO PROVIDED";
  document.querySelector(".info__population").textContent =
    convertNumberToString(
      globalVariable.allPlayerArrNoChange[order].countryData?.population
    ) || "NO PROVIDED";
  document.querySelector(".info__currencies").textContent = globalVariable
    .allPlayerArrNoChange[order].countryData?.currencies
    ? Object.keys(
        globalVariable.allPlayerArrNoChange[order].countryData?.currencies
      )[0]
    : "NO PROVIDED";

  document.querySelector(".info__language").textContent =
    Object.values(
      globalVariable.allPlayerArrNoChange[order].countryData?.languages
    )[0] || "NO PROVIDED";
}

function convertNumberToString(num) {
  if (num === undefined) return null;

  let newNum;
  if (num > 1000000) {
    newNum = String((num / 1000000).toFixed(1)) + "M";
    return newNum;
  } else if (num > 1000) {
    newNum = String((num / 1000).toFixed(1)) + "K";
    return newNum;
  }

  return String(num);
}
