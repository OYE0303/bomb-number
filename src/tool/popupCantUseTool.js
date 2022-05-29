import {
  popupCantUseToolDescription,
  popupCantUseTool as popupCantUseToolDom,
  btnCantUseTool,
} from "../selector/selector.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";
import wait from "../utils/wait.js";
import closePopupOverlay from "../popupOverlay/closePopupOverlay.js";

function popupCantUseTool() {
  btnCantUseTool.addEventListener("click", closePopupCantUseTool);
}

export default popupCantUseTool;

function showPopupCantUseTool(counts = false) {
  showPopupOverlay("cantUseTool");

  // set content of different error
  if (counts) {
    popupCantUseToolDescription.textContent =
      "You used up all of your tool counts";
  } else {
    popupCantUseToolDescription.textContent =
      "Tool cannot be used during another player's round";
  }

  popupCantUseToolDom.classList.remove("hidden--display");

  wait(0).then(() => popupCantUseToolDom.classList.remove("hidden--opacity"));
}

function closePopupCantUseTool() {
  closePopupOverlay();
  popupCantUseToolDom.classList.add("hidden--display");
  popupCantUseToolDom.classList.add("hidden--opacity");
}

export { showPopupCantUseTool, closePopupCantUseTool };
