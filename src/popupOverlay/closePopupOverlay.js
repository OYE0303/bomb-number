import globalVariable from "../globalVariable/globalVariable.js";
import { popupOverlay } from "./../selector/selector.js";

function closePopupOverlay() {
  globalVariable.popupOpening = null;
  popupOverlay.classList.add("hidden--display");
}

export default closePopupOverlay;
