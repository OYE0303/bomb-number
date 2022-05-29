import { btnGuessInput } from "./../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import { showGuessInput } from "./../guessNumber/guessInput.js";
import { showPlayerOrderUI } from "./../order/playerOrderUI.js";
import showCountdown from "../countDown/showCountdown.js";

function userTurn(firstTime = false) {
  if (!firstTime) btnGuessInput.classList.remove("hidden--display");

  showGuessInput();
  showPlayerOrderUI("Your turn");

  globalVariable.myTurn = true;

  showCountdown();
}

export default userTurn;
