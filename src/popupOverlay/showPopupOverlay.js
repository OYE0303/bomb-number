import globalVariable from "../globalVariable/globalVariable.js";
import { popupOverlay } from "./../selector/selector.js";

function showPopupOverlay(popupOpening) {
  globalVariable.popupOpening = popupOpening;
  popupOverlay.classList.remove("hidden--display");
}

export default showPopupOverlay;
