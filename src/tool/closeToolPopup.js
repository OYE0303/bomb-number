import { popupTool } from "./../selector/selector.js";
import closePopupOverlay from "../popupOverlay/closePopupOverlay.js";
function closeToolPopup() {
  popupTool.classList.add("hidden--display");
  closePopupOverlay();
}

export default closeToolPopup;
