import { guessOrder } from "./../selector/selector.js";

function showPlayerOrderUI(order) {
  guessOrder.textContent = order;
  guessOrder.classList.add("player--animation");
}

function closePlayerOrderUI() {
  guessOrder.textContent = "";
  guessOrder.classList.remove("player--animation");
}

export { showPlayerOrderUI, closePlayerOrderUI };
