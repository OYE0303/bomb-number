import {
  popupComputerLoseGame as popupComputerLoseGameDom,
  popupComputerLoseGameCountryName,
  bombNumberComputer,
  rangeNumberMax,
  rangeNumberMin,
  btnPopupComputerLoseGame,
} from "../selector/selector.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";
import closePopupOverlay from "../popupOverlay/closePopupOverlay.js";
import globalVariable from "../globalVariable/globalVariable.js";
import checkOrderAndUpdate from "../order/checkOrderAndUpdate.js";
import deleteElementFromArray from "../utils/deleteElementFromArray.js";
import createTargetNumber from "../utils/createTargetNumber.js";

function popupComputerLoseGame() {
  btnPopupComputerLoseGame.addEventListener(
    "click",
    closePopupComputerLoseGame
  );
}

function showPopupComputerLoseGame() {
  showPopupOverlay();
  popupComputerLoseGameDom.classList.remove("hidden--display");

  // show which conutry(player) lose the game
  popupComputerLoseGameCountryName.textContent =
    globalVariable.allPlayerArr[globalVariable.currentOrder].countryName;

  // show bomb number
  bombNumberComputer.textContent = globalVariable.targetNumber;
}

function closePopupComputerLoseGame() {
  closePopupOverlay();
  popupComputerLoseGameDom.classList.add("hidden--display");

  // hide bomb number
  bombNumberComputer.textContent = "";

  // eliminate player
  eliminatePlayerAndReset(globalVariable.currentOrder);
  checkOrderAndUpdate();
}

export default popupComputerLoseGame;
export { showPopupComputerLoseGame, closePopupComputerLoseGame };

function eliminatePlayerAndReset(playerNumber) {
  const playerElement = globalVariable.allPlayerArr[playerNumber];

  const newPlayerArr = deleteElementFromArray(
    globalVariable.allPlayerArr,
    playerElement
  );

  // reset all player array
  globalVariable.allPlayerArr = newPlayerArr;

  resetNumberRange();

  // reset target number
  createTargetNumber();

  nextPlayerAfterElimination();
}

function resetNumberRange() {
  globalVariable.minNumber = 0;
  globalVariable.maxNumber = globalVariable.maxNumberNoChange;

  // set range number on UI
  rangeNumberMax.textContent = globalVariable.maxNumber;
  rangeNumberMin.textContent = globalVariable.minNumber;
}

/*
  Here, we make sure the next player is correct
  If now it's not reverse, we have to let order be the previose one
  Because later will increase one and this.allPlayerArr is change too
  If it's reverse, then do nothing
  (try to graph and think)

  Imagine the current eliminated player is player 1
  So the length of allPlayerArr = 4 - 1 = 3 [0, 1, 2]
  In normal case, the next player should still be 1
  Why?
  Because the player 1 is the original player 2 after elimination
  Without this function
  After eliminating player 1, the next player would skip the player 2
  Because current order 1 + 1 = 2
  And the allPlayerArr is [0, 1, 2] after elimination
  */
function nextPlayerAfterElimination() {
  if (!globalVariable.reverse) {
    globalVariable.currentOrder = globalVariable.currentOrder - 1;
  }
}
