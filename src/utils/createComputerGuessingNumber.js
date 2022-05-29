import createRandomNumber from "./createRandomNumber.js";

function createComputerGuessingNumber(min, max) {
  return createRandomNumber(min + 1, max - 1);
}

export default createComputerGuessingNumber;
