import {
  formCountryRegionSelect,
  formCountryNameSelect,
  btnFormCountryNext,
  btnFormCountryBack,
  formBtnCountryRandom,
  formCountryRegion,
  formCountryImg,
} from "./../selector/selector.js";
import showErrorModal from "../utils/showErrorModal.js";
import globalVariable from "../globalVariable/globalVariable.js";
import createRandomNumber from "../utils/createRandomNumber.js";
import { nextFormPage } from "./formOrder.js";
import { formRangeInputChangeHandler } from "./formRange.js";

function formCountry() {
  formCountryRegionSelect.addEventListener(
    "input",
    formCountryRegionSelectChangeHandler
  );

  formCountryNameSelect.addEventListener(
    "input",
    formCountryNameSelectChangeHandler
  );

  btnFormCountryNext.addEventListener("click", btnFormCountryNextClickHandler);

  formBtnCountryRandom.addEventListener("click", btnRandomClickHandler);
}

export default formCountry;

async function formCountryRegionSelectChangeHandler() {
  const region = formCountryRegionSelect.value;

  disabledCountryBtn();

  try {
    await showSelectCountryAndImg(region);
  } catch (err) {
    showErrorModal();
  }

  activeCountryBtn();
}

function btnFormCountryNextClickHandler() {
  globalVariable.userCountryInfo.countryName = formCountryNameSelect.value;

  nextFormPage();

  // show form range UI
  formRangeInputChangeHandler();
}

async function formCountryNameSelectChangeHandler() {
  const countryName = formCountryNameSelect.value;

  disabledCountryBtn();
  try {
    await showFormCountryImg(countryName);
  } catch (err) {
    showErrorModal();
  }
  activeCountryBtn();
}

async function btnRandomClickHandler() {
  disabledCountryBtn();

  if (!globalVariable.cacheAllCountryData) {
    try {
      showRandomlySelectLoading();
      const res = await fetch("https://restcountries.com/v3.1/all");

      if (res.status !== 200) {
        throw new Error();
      }

      const data = await res.json();

      if (!data) {
        throw new Error();
      }

      globalVariable.cacheAllCountryData = data || [];

      removeRandomlySelectLoading();
    } catch (err) {
      showErrorModal();
    }
  }

  const randomNum = createRandomNumber(
    0,
    globalVariable.cacheAllCountryData.length - 1
  );
  const randomCountry = globalVariable.cacheAllCountryData[randomNum];
  const region = randomCountry.region;

  // show the region
  formCountryRegionSelect.value = randomCountry.region;

  try {
    // handle the process after seleting the region
    await showSelectCountryAndImg(region, randomCountry.name.official);
  } catch (err) {
    showErrorModal();
  }

  activeCountryBtn();
}

async function showSelectCountryAndImg(region, randomCountry = null) {
  removePreCountrySelect();

  if (globalVariable.cacheRegion[region]) {
    showFormCountryNameSelect(globalVariable.cacheRegion[region]);
    try {
      await hasRandomCountryAndShowImg(
        randomCountry,
        globalVariable.cacheRegion[region][0]
      );
    } catch (err) {
      showErrorModal();
    }
    return;
  }

  showCountrySelectLoading();

  let countryData;
  try {
    countryData = await getCountryDataFromRegion(region);
  } catch (err) {
    showErrorModal();
  }

  globalVariable.cacheRegion[region] = countryData;
  removeCountrySelectLoading();

  // show the next button
  btnFormCountryNext.classList.remove("hidden--display");

  showFormCountryNameSelect(countryData);

  try {
    await hasRandomCountryAndShowImg(randomCountry, countryData[0]);
  } catch (err) {
    showErrorModal();
  }
}

async function getCountryDataFromRegion(region) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);

    if (res.status !== 200) {
      throw new Error();
    }

    const data = await res.json();

    if (!data) {
      throw new Error();
    }

    /*
      data is an array containing many object
      But we only want name property
      */
    const countryNameArr = data.map(({ name: { official } }) => official);
    return countryNameArr;
  } catch (err) {
    showErrorModal();
  }
}

async function hasRandomCountryAndShowImg(randomCountry, countryData) {
  if (randomCountry) {
    // show the name
    formCountryNameSelect.value = randomCountry;

    try {
      await showFormCountryImg(randomCountry);
    } catch (err) {
      showErrorModal();
    }
  } else {
    try {
      await showFormCountryImg(countryData);
    } catch (err) {
      showErrorModal();
    }
  }
}

async function showFormCountryImg(country) {
  showImgLoading();

  try {
    const countryFlag = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );

    if (countryFlag.status !== 200) {
      throw new Error();
    }

    const [
      {
        flags: { svg: data },
      },
    ] = await countryFlag.json();

    if (data === undefined) {
      throw new Error();
    }

    // change the image
    formCountryImg.setAttribute("src", data);
    // formCountryImg.src = data;
    removeImgLoading();
  } catch (err) {
    showErrorModal();
  }
}

function removePreCountrySelect() {
  // convert children to array
  const countryNameChildren = Array.from(formCountryNameSelect.children);

  // if selected before, delete original one
  countryNameChildren.forEach((child) => formCountryNameSelect.remove(child));
}

function showFormCountryNameSelect(countryNameArr) {
  let html = ``;
  countryNameArr.forEach((country) => {
    html += `<option value="${country}">${country}</option>`;
  });

  formCountryNameSelect.insertAdjacentHTML("beforeend", html);
}

function showRandomlySelectLoading() {
  // add loading text
  formCountryRegionSelect.insertAdjacentHTML(
    "beforeend",
    `<option disabled selected class="form__country__option form__country__option--loading form__country__option--loading--region text-cap" value = "loading">
          loading...
       </option>`
  );

  // add disabled style
  formCountryRegionSelect.classList.add("form__country__select--disabled");

  // set disabled true
  formCountryRegionSelect.disabled = true;

  showCountrySelectLoading();
}

function disabledCountryBtn() {
  btnFormCountryNext.disabled = true;
  btnFormCountryBack.disabled = true;
  formBtnCountryRandom.disabled = true;

  btnFormCountryNext.classList.add("form__btn--country--disabled");
  btnFormCountryBack.classList.add("form__btn--country--disabled");
  formBtnCountryRandom.classList.add("form__btn--country--disabled");

  btnFormCountryNext.classList.remove("btn--blue");
  btnFormCountryBack.classList.remove("btn--pink");
  formBtnCountryRandom.classList.remove("btn--purple");
}

function activeCountryBtn() {
  btnFormCountryNext.disabled = false;
  btnFormCountryBack.disabled = false;
  formBtnCountryRandom.disabled = false;

  btnFormCountryNext.classList.remove("form__btn--country--disabled");
  btnFormCountryBack.classList.remove("form__btn--country--disabled");
  formBtnCountryRandom.classList.remove("form__btn--country--disabled");

  btnFormCountryNext.classList.add("btn--blue");
  btnFormCountryBack.classList.add("btn--pink");
  formBtnCountryRandom.classList.add("btn--purple");
}

function showImgLoading() {
  // hidden the image
  formCountryImg.classList.add("hidden--display");

  // show the loading
  formCountryRegion.insertAdjacentHTML(
    "beforeend",
    `<div class="form__country__loading" ></div>`
  );
}

function removeImgLoading() {
  // remove the hidden
  formCountryImg.classList.remove("hidden--display");

  // remove the loading
  document.querySelector(".form__country__loading").remove();
}

function showCountrySelectLoading() {
  formCountryImg.classList.add("hidden--opacity");
  formCountryNameSelect.insertAdjacentHTML(
    "beforeend",
    `<option selected disabled class="form__country__option form__country__option--loading text-cap" value = "loading">
          loading...
          </option>`
  );
  formCountryNameSelect.classList.add("form__country__select--disabled");
  formCountryNameSelect.disabled = true;
}

function removeCountrySelectLoading() {
  formCountryNameSelect.remove(
    document.querySelector(".form__country__option--loading")
  );
  formCountryImg.classList.remove("hidden--opacity");
  formCountryNameSelect.classList.remove("form__country__select--disabled");
  formCountryNameSelect.disabled = false;
}

function removeRandomlySelectLoading() {
  // remove loading text
  formCountryRegionSelect.removeChild(
    document.querySelector(".form__country__option--loading--region")
  );

  // remove disabled style
  formCountryRegionSelect.classList.remove("form__country__select--disabled");

  // set disabled false
  formCountryRegionSelect.disabled = false;

  removeCountrySelectLoading();
}
