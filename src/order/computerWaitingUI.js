import {
  guessOrder,
  waiting,
  bounce1,
  bounce2,
  bounce3,
} from "../selector/selector.js";

function showComputerWaitingUI(playerCountry) {
  guessOrder.textContent = playerCountry;

  waiting.forEach((wait) => wait.classList.remove("hidden--display"));
  bounce1.classList.add("spinner--animation1");
  bounce2.classList.add("spinner--animation2");
  bounce3.classList.add("spinner--animation3");
}

function closeComputerWaitingUI() {
  guessOrder.textContent = "";

  waiting.forEach((wait) => wait.classList.add("hidden--display"));
  bounce1.classList.remove("spinner--animation1");
  bounce2.classList.remove("spinner--animation2");
  bounce3.classList.remove("spinner--animation3");
}

export { showComputerWaitingUI, closeComputerWaitingUI };
