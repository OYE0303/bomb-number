import { countdownTime, popupUseTool } from "./../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import closePopupOverlay from "../popupOverlay/closePopupOverlay.js";
import { btnCheckClickHandler } from "./../guessNumber/btnCheckClick.js";

function showCountdown() {
  let i = 30;
  countdownTime.style.color = "var(--white-light)";
  countdownTime.textContent = `00:30`;
  globalVariable.countDown = setInterval(() => {
    if (i >= 10) {
      countdownTime.textContent = `00:${i}`;
    } else {
      countdownTime.textContent = `00:0${i}`;
      countdownTime.style.color = "var(--pink)";
    }
    i--;
    if (i < 0) {
      // close use tool popup and tool extension
      popupUseTool.classList.add("hidden--display");
      closePopupOverlay();

      btnCheckClickHandler(null, true);
      clearInterval(globalVariable.countDown);
      countdownTime.textContent = ``;
    }
  }, 1000);
}

export default showCountdown;
