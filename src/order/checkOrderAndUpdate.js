import globalVariable from "../globalVariable/globalVariable.js";
import userTurn from "./userTurn.js";
import createRandomNumber from "../utils/createRandomNumber.js";
import wait from "../utils/wait.js";
import closePlayerOrderUI from "./closePlayerOrderUI.js";
import createComputerGuessingNumber from "../utils/createComputerGuessingNumber.js";
import {
  showComputerWaitingUI,
  closeComputerWaitingUI,
} from "./computerWaitingUI.js";
import takeGuessInput from "../guessNumber/takeGuessInput.js";

// use this.reverse to check current order
function checkOrderAndUpdate() {
  if (globalVariable.reverse) {
    updateCounterClockwiseOrder();
  } else {
    updateClockwiseOrder();
  }
  updateOrderUI(globalVariable.currentOrder);
}

export default checkOrderAndUpdate;

function updateClockwiseOrder() {
  globalVariable.currentOrder++;

  if (globalVariable.currentOrder >= globalVariable.allPlayerArr.length)
    globalVariable.currentOrder = 0;
}

function updateCounterClockwiseOrder() {
  globalVariable.currentOrder--;

  if (globalVariable.currentOrder <= -1)
    globalVariable.currentOrder = globalVariable.allPlayerArr.length - 1;
}

function updateOrderUI(order) {
  // first empty the order UI
  closePlayerOrderUI();

  // it's user's turn
  if (order === 0) {
    userTurn();
  }
  // it's computer's turn
  else {
    const currentCountryName = globalVariable.allPlayerArr[order].countryName;

    // wait for computer's guessing(pretend computer is thinking(guessing))
    waitComputerGuessingNumber(currentCountryName);
  }
}

function waitComputerGuessingNumber(currentCountryName) {
  const randomTime = createRandomNumber(1, 5);

  showComputerWaitingUI(currentCountryName);

  wait(randomTime).then(() => {
    // after waiting, do these two things
    closeComputerWaitingUI();

    // next player
    takeComputerGuessInput();
  });
}

function takeComputerGuessInput() {
  // create random guessing number for computer
  const guessNumber = createComputerGuessingNumber(
    globalVariable.minNumber,
    globalVariable.maxNumber
  );

  takeGuessInput(guessNumber, false);
}
