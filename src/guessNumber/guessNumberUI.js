import { guessNumber } from "./../selector/selector.js";

function showGuessNumberUI(number) {
  guessNumber.textContent = number;
  guessNumber.classList.remove("hidden--opacity");
  guessNumber.classList.add("guess__number--animation");
}

function closeGuessNumberUI() {
  guessNumber.textContent = "";
  guessNumber.classList.add("hidden--opacity");
  guessNumber.classList.remove("guess__number--animation");
}

export { showGuessNumberUI, closeGuessNumberUI };
