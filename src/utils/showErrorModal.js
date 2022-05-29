import {
  formContainer,
  page,
  info,
  allPopup,
  popupError,
} from "./../selector/selector.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";

function showErrorModal() {
  formContainer.forEach((element) => element.classList.add("hidden--display"));

  page.forEach((element) => element.classList.add("hidden--display"));

  info.classList.add("hidden--display");

  allPopup.forEach((element) => element.classList.add("hidden--display"));

  showPopupOverlay();
  popupError.classList.remove("hidden--display");
}

export default showErrorModal;
