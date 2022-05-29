import {
  popupQuestion,
  popupRule,
  popupDiffLevel,
  popupTool,
} from "./../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";

function popupDiffQuestion() {
  popupQuestion.addEventListener("click", showPopupDiffQuestion);
}

export default popupDiffQuestion;

// use one callback function attach on one enitre question pop up
// use .contains to check what button is user currently clicking
function showPopupDiffQuestion(e) {
  const targetElement = e.target;

  if (targetElement.classList.contains("btn__popup__question")) {
    /*
      avoid accidentally closing the question popup
      when showing different question content
      user can't click overlay to close the popup
      we have to manually set this.popupOpening to different value
      so that popupOverlayClick function won't go inside "question" in switch case
      Later, when closing this content, we set back to "question" (see closePopup function)
      */
    globalVariable.popupOpening = "question-content";
    popupQuestion.classList.add("hidden--display");

    if (targetElement.classList.contains("btn__popup__question__rule")) {
      popupRule.classList.remove("hidden--display");
    }

    if (targetElement.classList.contains("btn__popup__question__level")) {
      popupDiffLevel.classList.remove("hidden--display");
    }

    if (targetElement.classList.contains("btn__popup__question__tool")) {
      popupTool.classList.remove("hidden--display");
    }
  }
}
