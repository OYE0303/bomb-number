import { countdownTime } from "./../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";

function closeCountDown() {
  clearInterval(globalVariable.countDown);
  countdownTime.textContent = ``;
}

export default closeCountDown;
