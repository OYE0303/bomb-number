import playerInfo from "../others/playerInfo.js";

const userCountryInfo = new playerInfo();
const Computer1CountryInfo = new playerInfo();
const Computer2CountryInfo = new playerInfo();
const Computer3CountryInfo = new playerInfo();
const allPlayerArr = [
  userCountryInfo,
  Computer1CountryInfo,
  Computer2CountryInfo,
  Computer3CountryInfo,
];

export default {
  // PLAYER INFO
  userCountryInfo,
  Computer1CountryInfo,
  Computer2CountryInfo,
  Computer3CountryInfo,

  // FORM ARRAY & ORDER
  formCollection: Array.from(document.querySelectorAll(".form__container")),
  formOrder: 0,

  // userName
  userName: null,

  // LEVEL
  level: "easy",

  // NUMBER
  targetNumber: null,
  minNumber: 0,
  maxNumber: 0,
  maxNumberNoChange: 0,

  // CLICK TOGGLE
  btnToolToggle: true,
  btnMenuToggle: true,

  // PLAYER ORDER ARRAY
  allPlayerArr,
  allPlayerArrNoChange: [...allPlayerArr], // for country inf,

  // REVERSE & ORDER
  reverse: false,
  currentOrder: 0,
  myTurn: true,

  // COUNT DOWN (for clearSettimeInterval)
  countDown: null,

  // Guessing Animation Duration
  guessAnimationTime: 5,

  // cache (region) (select)
  cacheAllCountryData: null,
  cacheRegion: {},

  btnToolQuestion: false,

  popupOpening: null,
};

// export default {
//   formOrder: 0,
//   targetNumber: null,
//   minNumber: 0,
//   maxNumber: 0,
//   maxNumberNoChange: 0,
//   userName: null,
//   level: "easy",
//   userCountryInfo,
//   Computer1CountryInfo,
//   Computer2CountryInfo,
//   Computer3CountryInfo,
//   popupOpening: null,
//   cacheRegion: {},
//   cacheAllCountryData: null,
//   formCollection: Array.from(document.querySelectorAll(".form__container")),
//   countDown: null,
//   reverse: false,
//   currentOrder: 0,
//   myTurn: true,
//   allPlayerArr: [
//     userCountryInfo,
//     Computer1CountryInfo,
//     Computer2CountryInfo,
//     Computer3CountryInfo,
//   ],
//   guessAnimationTime: 5,
//   btnToolToggle: true,
//   btnMenuToggle: true,
// };
