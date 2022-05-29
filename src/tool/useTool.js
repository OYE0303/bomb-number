import {
  remaingCounts,
  btnGuessInput,
  btnPopupUseToolYes,
} from "../selector/selector.js";
import { closePlayerOrderUI } from "../order/playerOrderUI.js";
import globalVariable from "../globalVariable/globalVariable.js";
import { closeGuessInput } from "./../guessNumber/guessInput.js";
import { toolBtnToggleHandler } from "./toolBtnToggle.js";
import closeCountDown from "./../countDown/closeCountdown.js";
import useToolLogic from "./useToolLogic.js";

function useTool() {
  btnPopupUseToolYes.addEventListener("click", useToolClickHandler);
}

export default useTool;

function useToolClickHandler(e) {
  globalVariable.userCountryInfo.toolCounts--;

  // reset all counts UI
  remaingCounts.forEach(
    (count) => (count.textContent = globalVariable.userCountryInfo.toolCounts)
  );

  // close "Your turn" UI
  closePlayerOrderUI();

  // close guess input UI
  closeGuessInput();

  // close tool UI
  toolBtnToggleHandler();

  // not my turn anymore
  globalVariable.myTurn = false;

  // close countdown
  closeCountDown();

  // close check button
  btnGuessInput.classList.add("hidden--display");

  // get the used tool
  const tool = e.target
    .closest(".popup__tool__use")
    .querySelector(".popup__tool__use__icon").dataset.id;

  useToolLogic(tool, globalVariable.userCountryInfo.countryName);
}
