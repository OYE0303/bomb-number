import { popupTool, btnToolQuestion } from "./../selector/selector.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";
import globalVariable from "../globalVariable/globalVariable.js";

function showDiffToolUI() {
  btnToolQuestion.forEach((btn) =>
    btn.addEventListener("click", showDiffToolUIHandler)
  );
}

export default showDiffToolUI;

function showDiffToolUIHandler() {
  showPopupOverlay("tool");
  popupTool.classList.remove("hidden--display");
  globalVariable.btnToolQuestion = true;
}
