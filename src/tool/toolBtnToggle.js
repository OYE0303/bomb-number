import {
  btnToolUse,
  toolContainer,
  toolItem,
  btnTool,
} from "../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";

function toolBtnToggle() {
  btnTool.addEventListener("click", toolBtnToggleHandler);
}

function toolBtnToggleHandler() {
  if (globalVariable.btnToolToggle) {
    showTool();
    globalVariable.btnToolToggle = false;
  } else {
    closeTool();
    globalVariable.btnToolToggle = true;
  }
}
export default toolBtnToggle;
export { toolBtnToggleHandler };

function showTool() {
  btnToolUse.forEach((element) => {
    element.disabled = false;
  });

  toolContainer.style.height = "20rem";

  toolContainer.classList.remove("hidden--opacity");

  toolItem.forEach((element) => {
    element.classList.remove("hidden--opacity");
  });
}

function closeTool() {
  toolContainer.style.height = "0";

  toolContainer.classList.add("hidden--opacity");

  toolItem.forEach((element) => {
    element.classList.add("hidden--opacity");
  });

  btnToolUse.forEach((element) => {
    element.disabled = true;
  });
}
