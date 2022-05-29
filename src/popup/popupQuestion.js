import {
  popupQuestion as popupQuestionDom,
  formRange,
  formOverlay,
  btnNavQuestion,
  btnPopupCloseQuestion,
  btnFormCheckFaq,
} from "../selector/selector.js";
import showPopupOverlay from "../popupOverlay/showPopupOverlay.js";
import closePopupOverlay from "../popupOverlay/closePopupOverlay.js";
import wait from "../utils/wait.js";
import globalVariable from "../globalVariable/globalVariable.js";

function popupQuestion() {
  btnNavQuestion.addEventListener("click", showPopupQuestion);

  btnPopupCloseQuestion.addEventListener("click", closePopupQuestion);

  btnFormCheckFaq.addEventListener("click", showPopupQuestionInForm);
}

export default popupQuestion;
export { closePopupQuestion };

function showPopupQuestion() {
  showPopupOverlay("question");

  popupQuestionDom.classList.remove("hidden--display");

  wait(0).then(() => popupQuestionDom.classList.remove("hidden--opacity"));
}

function closePopupQuestion() {
  if (!globalVariable.targetNumber) {
    closePopupQuestionInForm();
  } else {
    closePopupOverlay();
    popupQuestionDom.classList.add("hidden--display");
    popupQuestionDom.classList.add("hidden--opacity");
  }
}

function showPopupQuestionInForm() {
  showPopupOverlay();
  popupQuestionDom.classList.remove("hidden--display");

  formRange.classList.add("hidden--display");
  formOverlay.classList.add("hidden--display");
}

function closePopupQuestionInForm() {
  closePopupOverlay();
  popupQuestionDom.classList.add("hidden--display");

  formRange.classList.remove("hidden--display");
  formOverlay.classList.remove("hidden--display");
}
