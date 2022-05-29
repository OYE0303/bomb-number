import {
  popupLevel as popupLevelDom,
  btnShowLevel,
  btnPopupLevelNo,
  btnPopupLevelYes,
} from "../selector/selector.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";
import closePopupOverlay from "../popupOverlay/closePopupOverlay.js";
import wait from "../utils/wait.js";

function popupLevel() {
  btnShowLevel.addEventListener("click", showPopupLevel);
  btnPopupLevelNo.addEventListener("click", closePopupLevel);
  btnPopupLevelYes.addEventListener("click", changeLevel);
}

function showPopupLevel() {
  showPopupOverlay("level");

  popupLevelDom.classList.remove("hidden--display");

  wait(0).then(() => {
    popupLevelDom.classList.remove("hidden--opacity");
  });
}

function closePopupLevel() {
  closePopupOverlay();

  popupLevelDom.classList.add("hidden--display");
  popupLevelDom.classList.add("hidden--opacity");
}

function changeLevel() {
  location.reload();
}

export default popupLevel;
export { closePopupLevel };
