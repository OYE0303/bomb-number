import { popupUserWinGame } from "./../selector/selector.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";
import globalVariable from "../globalVariable/globalVariable.js";

function showPopupUserWinGame() {
  showPopupOverlay();
  popupUserWinGame.classList.remove("hidden--display");
  document.querySelector(".popup__userWinGame__currentLevel").textContent =
    globalVariable.level;

  document
    .querySelector(".btn__popup__restart--win")
    .addEventListener("click", function () {
      location.reload();
    });
}

export default showPopupUserWinGame;
