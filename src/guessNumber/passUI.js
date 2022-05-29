import { guessNumber } from "./../selector/selector.js";

function showPassUI() {
  guessNumber.textContent = "PASS";
  guessNumber.classList.add("pass--animation");
}

function closePassUI() {
  guessNumber.textContent = "";
  guessNumber.classList.remove("pass--animation");
}

export { showPassUI, closePassUI };
