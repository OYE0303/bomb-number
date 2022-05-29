import wait from "../utils/wait.js";
import { showUseToolUI, closeUseToolUI } from "./useToolUI.js";
import checkOrderAndUpdate from "../order/checkOrderAndUpdate.js";
import globalVariable from "../globalVariable/globalVariable.js";
import createRandomNumber from "../utils/createRandomNumber.js";

function useToolLogic(tool, playerName) {
  wait(0)
    .then(() => {
      toolFunctionality(tool);
    })
    .then(() => {
      showUseToolUI(tool, playerName);

      return wait(3);
    })
    .then(() => {
      // later, close whole UI
      closeUseToolUI();

      // next round
      checkOrderAndUpdate();
    });
}

export default useToolLogic;

function toolFunctionality(tool) {
  // pass
  if (tool === "PASS") {
    return;
  }

  // uturn
  if (tool === "U-TURN") {
    globalVariable.reverse = !globalVariable.reverse;
    return;
  }

  // assign
  const assignOrder = document.querySelector(".popup__assign__select");

  /*
    If html has popup__assign__select element
    It means it's the time user using the assign 
    */
  if (assignOrder) {
    globalVariable.currentOrder = assignOrder.value;
  }
  // computer use assign
  else {
    // avoid assign itself
    let randomNumAssign;

    while (true) {
      randomNumAssign = createRandomNumber(
        0,
        globalVariable.allPlayerArr.length
      );

      /*
        edge case
        This is when current player is the last player
        And it's in reverse order
        At this point, this player cannot assign 0
        Because 0 - 1(reverse) = -1
        And later it will automatically set back to this.allPlayerArr.length - 1
        Which is the situation assign itself
        */
      if (
        globalVariable.currentOrder ===
          globalVariable.allPlayerArr.length - 1 &&
        globalVariable.reverse &&
        randomNumAssign === 0
      )
        continue;

      /*
        avoid assign itself
        Logic
        if now it's reverse, we don't wanna select a random number === current order + 1
        because later will immediately subtract one on current order, then it will back to itself
        same for non-reverse
        */
      if (globalVariable.reverse) {
        if (randomNumAssign !== globalVariable.currentOrder + 1) break;
      } else if (randomNumAssign !== globalVariable.currentOrder - 1) break;
    }

    globalVariable.currentOrder = randomNumAssign;
  }
}
