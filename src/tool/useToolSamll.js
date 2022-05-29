import { popupUseTool, toolItemName } from "../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import { showPopupCantUseTool } from "./popupCantUseTool.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";
import showPopupUseToolUI from "./showPopupUseToolUI.js";

function useToolSmall() {
  toolItemName.forEach((toolName) =>
    toolName.addEventListener("click", useToolSmallHandler)
  );
}

export default useToolSmall;

function useToolSmallHandler(e) {
  if (window.innerWidth <= 1200) {
    // first check if it's user's turn
    if (!globalVariable.myTurn) {
      showPopupCantUseTool();
      return;
    }

    // then check counts if can use tool
    if (globalVariable.userCountryInfo.toolCounts === 0) {
      showPopupCantUseTool(true);
      return;
    }

    // okay, user can use tool
    showPopupOverlay();
    popupUseTool.classList.remove("hidden--display");

    showPopupUseToolUI(e.target.dataset.id);
  }
}
