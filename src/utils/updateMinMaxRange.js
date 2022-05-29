import { rangeNumberMax, rangeNumberMin } from "../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import wait from "./wait.js";

function updateMinMaxRange(guessNumber) {
  // change max number and show UI
  if (guessNumber > globalVariable.targetNumber) {
    globalVariable.maxNumber = guessNumber;
    showRangeNumberMaxUI(guessNumber);
  }

  // change min number and show UI
  else if (guessNumber < globalVariable.targetNumber) {
    globalVariable.minNumber = guessNumber;
    showRangeNumberMinUI(guessNumber);
  }
}

export default updateMinMaxRange;

function showRangeNumberMinUI(min) {
  rangeNumberMin.textContent = min;
  rangeNumberMin.classList.add("range__number--animation");

  // remove animation class after animation
  wait(4).then(() =>
    rangeNumberMin.classList.remove("range__number--animation")
  );
}

function showRangeNumberMaxUI(max) {
  rangeNumberMax.textContent = max;
  rangeNumberMax.classList.add("range__number--animation");

  // remove animation class after animation
  wait(4).then(() =>
    rangeNumberMax.classList.remove("range__number--animation")
  );
}
