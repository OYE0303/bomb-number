import { guessOrder } from "./../selector/selector.js";

function closePlayerOrderUI() {
  guessOrder.textContent = "";
  guessOrder.classList.remove("player--animation");
}

export default closePlayerOrderUI;
