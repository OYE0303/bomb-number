import wait from "../utils/wait.js";
import globalVariable from "../globalVariable/globalVariable.js";
import createRandomNumber from "../utils/createRandomNumber.js";
import showPopupUserLoseGame from "../gameResult/showPopupUserLoseGame.js";
import showPopupUserWinGame from "../gameResult/showPopupUserWinGame.js";
import computerLoseGame from "../gameResult/computerLoseGame.js";
import updateMinMaxRange from "./../utils/updateMinMaxRange.js";
import { showPassUI, closePassUI } from "./passUI.js";
import { showGuessNumberUI, closeGuessNumberUI } from "./guessNumberUI.js";
import checkOrderAndUpdate from "../order/checkOrderAndUpdate.js";
import useToolLogic from "../tool/useToolLogic.js";

function takeGuessInput(guessNumber, userPlayer = true) {
  /*
    Here, we have to first check if computer use tool
    Because it doesn't make sense use tool after showing guessing UI(see below)
    If computer decide using tool, diretly use tool, stop keeping executing
    If computer doesn't use tool, then keep executing(show guess UI....)
 
    Here, check three things in order
    (1) If it's in computer's guessing round
    (2) If computer guess the bomb number
    (3) If computer can use tool(toolCounts may be 0)
    Again, order DOES matter here
    */
  if (
    !userPlayer &&
    globalVariable.targetNumber === guessNumber &&
    computerGuessNumberLogic()
  ) {
    useToolComputer();
    return;
  }

  wait(0)
    // guessing UI
    .then(() => {
      // setting guessing animation time
      globalVariable.guessAnimationTime = createRandomNumber(2, 5);

      // guessNumber UI(pink & blue)
      showGuessNumberUI(guessNumber);

      // wait for the guessing animation time
      return wait(globalVariable.guessAnimationTime);
    })
    // check guessing number
    .then(() => {
      // guess the bomb number
      if (guessNumber === globalVariable.targetNumber) {
        if (userPlayer) {
          // user lose game UI
          showPopupUserLoseGame();
        } else {
          // user win the game
          if (globalVariable.allPlayerArr.length === 2) {
            showPopupUserWinGame();
          }
          // not yet win the game
          else computerLoseGame();
        }

        closeGuessNumberUI();
        return true;
      } else {
        // not guess the bomb number -> updating UI
        showPassUI();
        updateMinMaxRange(guessNumber);

        // wait another 3 second because showPassUI is exactly 3 second
        return wait(3);
      }
    })
    .then((arg) => {
      if (!arg) {
        closeGuessNumberUI();
        closePassUI();

        // update next order(go to next player)
        checkOrderAndUpdate();
      }
    });
}

export default takeGuessInput;

function computerGuessNumberLogic() {
  /*
    first check computer if is out of tool counts
    if yes, lose game
    then check if computer wants use tool
  */
  if (
    checkComputerUseToolCounts(
      globalVariable.allPlayerArr[globalVariable.currentOrder]
    ) ||
    checkIfComputerUseTool()
  ) {
    // lose game
    return false;
  }

  // use tool
  return true;
}

function useToolComputer() {
  // check current player(country)
  const currentCountryName =
    globalVariable.allPlayerArr[globalVariable.currentOrder].countryName;
  const tool = whichToolComputer();

  useToolLogic(tool, currentCountryName);
}

function checkComputerUseToolCounts(player) {
  if (player.toolCounts === 0) return true;
  player.toolCounts--;
  return false;
}

function checkIfComputerUseTool() {
  // if remaining only one guess number, defenitely use tool
  if (globalVariable.maxNumber - globalVariable.minNumber === 2) return false;

  // randomly decide if using the tools
  const randomNum = createRandomNumber(1, 100);
  if (randomNum % 2 === 0) return true;
  else return false;
}

function whichToolComputer() {
  const randomNumberTool = createRandomNumber(0, 2);

  // pass
  if (randomNumberTool == 1) {
    return "PASS";
  }
  // reverse
  else if (randomNumberTool == 2) {
    return "U-TURN";
  }
  // assign
  else {
    return "ASSIGN";
  }
}
