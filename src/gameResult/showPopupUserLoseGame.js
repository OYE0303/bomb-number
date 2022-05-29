import { popupUserLoseGame, bombNumberUser } from "./../selector/selector.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";
import globalVariable from "../globalVariable/globalVariable.js";

function showPopupUserLoseGame() {
  showPopupOverlay();
  popupUserLoseGame.classList.remove("hidden--display");
  bombNumberUser.textContent = globalVariable.targetNumber;

  // only user lose the game, add eventlistenr on reload btn
  document
    .querySelector(".btn__popup__restart--lose")
    .addEventListener("click", () => {
      location.reload();
    });
}

export default showPopupUserLoseGame;
