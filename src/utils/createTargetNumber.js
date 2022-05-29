import globalVariable from "../globalVariable/globalVariable.js";
import createRandomNumber from "./createRandomNumber.js";

function createTargetNumber() {
  globalVariable.targetNumber = createRandomNumber(
    1,
    globalVariable.maxNumber - 1
  );
}

export default createTargetNumber;
