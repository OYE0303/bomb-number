import { guessOrder } from "./../selector/selector.js";

function showPlayerOrderUI(order) {
  guessOrder.textContent = order;
  guessOrder.classList.add("player--animation");
}

export default showPlayerOrderUI;
