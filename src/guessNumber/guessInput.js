import { guessInput } from "./../selector/selector.js";

function showGuessInput() {
  guessInput.classList.remove("hidden--display");
}

function closeGuessInput() {
  guessInput.classList.add("hidden--display");
  guessInput.value = "";
}

export { showGuessInput, closeGuessInput };
