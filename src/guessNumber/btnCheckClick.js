import {
  guessInput,
  btnGuessInput,
  guessOrder,
} from "./../selector/selector.js";
import createComputerGuessingNumber from "../utils/createComputerGuessingNumber.js";
import globalVariable from "../globalVariable/globalVariable.js";
import closeCountDown from "../countDown/closeCountdown.js";
import takeGuessInput from "./takeGuessInput.js";
import { closePlayerOrderUI } from "./../order/playerOrderUI.js";
import { closeGuessInput } from "./guessInput.js";

function btnCheckClick() {
  btnGuessInput.addEventListener("click", btnCheckClickHandler);
}

function btnCheckClickHandler(e, random = false) {
  // prevent user accidentally input empty string
  if (!random && guessInput.value === "") return;

  // e may be null (user randomly guess number)
  e && e.preventDefault();

  let guessNumber;

  // randomly guess number(countdown to 0)
  if (random) {
    guessNumber = createComputerGuessingNumber(
      globalVariable.minNumber,
      globalVariable.maxNumber
    );
  }
  // manually guess number
  else {
    guessNumber = Number(guessInput.value);

    closeCountDown();
  }

  takeGuessInput(guessNumber);

  globalVariable.myTurn = false;

  // close "Your turn" UI
  closePlayerOrderUI();

  // close guess input
  // have to put here, or we cannot accept the user's input
  closeGuessInput();

  // hide submit btn
  btnGuessInput.classList.add("hidden--display");

  // remove invalid style
  guessOrder.classList.remove("guess__number--invalid");
}

export default btnCheckClick;
export { btnCheckClickHandler };
