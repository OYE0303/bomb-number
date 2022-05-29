import { btnPopupClose, popupQuestion } from "./../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import closeToolPopup from "../tool/closeToolPopup.js";

function closeAllPopup() {
  btnPopupClose.forEach((btnClose) =>
    btnClose.addEventListener("click", closeAllPopupHandler)
  );
}

export default closeAllPopup;

// add one callback function to different close button
// use .closest to check which popup should close
function closeAllPopupHandler(e) {
  const targetElement = e.target;

  /*
    Note there are two situations to show the popup__tool
    1. In the popup__question(in the form & during the game)
    2. In the tool button question(?)

    In the popup__question
    we wanna show the popup__question again after closing the popup__tool
    However, in the tool button question(?)
    we wanna directly close the popup__tool

    In order to fix the logic
    Initialize this.btnToolQuestion to false
    If clicking tool button question(?) to open the popup__tool
    set it to true
    So when closing the popup__tool, it won't show the popup__question
    also need to set back to false
    (else condition)
    If clicking popup__question
    We wanna show it again after closing popup__tool
    */
  if (!globalVariable.btnToolQuestion) {
    popupQuestion.classList.remove("hidden--display");

    /*
      set back to "question", so that now users can click popup overaly to close the question popup

      Let's reacp the whole logic
      1. we want to let user close the popup when clicking popup overlay
      2. the way doing this is adding one eventlistener on popup overlay
      3. when users click the button to open popup, we set this.popupOpening to certain value
      4. when users click popup overlay, we use this.popupOpening to check what popup we're gonna close
      5. when users click question popup, we set this.popupOpening to "question"
      6. but when users try to click button to specific question content, we set temporarily set this.popupOpening to "question-content"
      7. so that when users in the question-content, they won't accidentaly close the whole pop-up
      8. when users close the question-content popup, we set this.popupOpening back to "question"
      9. so that users can close popup question
      */
    globalVariable.popupOpening = "question";
  } else {
    globalVariable.btnToolQuestion = false;
    closeToolPopup();
    return;
  }

  // question
  if (targetElement.closest(".popup__question")) {
    targetElement.closest(".popup__question").classList.add("hidden--display");
  }

  // rule
  if (targetElement.closest(".popup__rule")) {
    targetElement.closest(".popup__rule").classList.add("hidden--display");
  }

  // diff level
  if (targetElement.closest(".popup__level__diff")) {
    targetElement
      .closest(".popup__level__diff")
      .classList.add("hidden--display");
  }

  // tool
  if (targetElement.closest(".popup__tool")) {
    targetElement.closest(".popup__tool").classList.add("hidden--display");
  }
}
