import {
  popupUseTool as popupUseToolDom,
  popupUseToolDescription,
  btnToolUse,
  btnPopupUseToolNo,
} from "../selector/selector.js";
import { showPopupCantUseTool } from "./popupCantUseTool.js";
import globalVariable from "../globalVariable/globalVariable.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";
import showPopupUseToolUI from "./showPopupUseToolUI.js";
import wait from "../utils/wait.js";
import closePopupOverlay from "../popupOverlay/closePopupOverlay.js";

function popupUseTool() {
  btnToolUse.forEach((btn) => btn.addEventListener("click", showPopupUseTool));
  btnPopupUseToolNo.addEventListener("click", closePopupUseTool);
}

function showPopupUseTool(e) {
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

  // okay, user can use tool, hide popup use tool
  showPopupOverlay("useTool");
  popupUseToolDom.classList.remove("hidden--display");

  showPopupUseToolUI(e.target.closest(".btn__tool--use").dataset.id);
}

function closePopupUseTool() {
  popupUseToolDom.classList.add("hidden--opacity");
  popupUseToolDescription.style.fontSize = "2.5rem";

  wait(0).then(() => {
    closePopupOverlay();
    popupUseToolDom.classList.add("hidden--display");
  });

  /*
    remove the svg icon in every time closing
    can't use DOM.popupUseToolIcon
    because there is no html element at the time we invoking the DOM__SELECTION
    so DOM.popupUseToolIcon === null
    popup__tool__use__icon is in the svgIcon
    which is added in the showPopupUseToolUI below
    SVG.assign, SVG.pass, SVG.uturn
    */
  document.querySelector(".popup__tool__use__icon").remove();

  /*
    also remove assign UI
    have to first check if element exist
    */
  document.querySelector(".popup__subtitle--assign") !== null &&
    document.querySelector(".popup__subtitle--assign").remove();
  document.querySelector(".popup__assign__select") !== null &&
    document.querySelector(".popup__assign__select").remove();
}

export default popupUseTool;
export { showPopupUseTool, closePopupUseTool };
