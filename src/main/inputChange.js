import {
  guessInput,
  btnGuessInput,
  guessOrder,
} from "./../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import { btnCheckClickHandler } from "./../guessNumber/btnCheckClick.js";

function inputChange() {
  guessInput.addEventListener(
    "keypress",
    enterPressHandler.bind(null, guessInput)
  );
  guessInput.addEventListener(
    "input",
    inputChangeHandler.bind(null, guessInput)
  );
}

function inputChangeHandler(e) {
  const value = Number(e.value);

  // invalid
  if (checkInput(value)) {
    guessInput.classList.add("guess__input--invalid");
    btnGuessInput.classList.add("hidden--display");
    guessOrder.textContent = "Invalid Number";
    guessOrder.classList.add("guess__number--invalid");
  }
  // valid
  else {
    guessInput.classList.remove("guess__input--invalid");
    btnGuessInput.classList.remove("hidden--display");
    guessOrder.textContent = "Your Turn";
    guessOrder.classList.remove("guess__number--invalid");
  }
}

function enterPressHandler(e) {
  if (e.code === "Enter" && !checkInput(Number(guessInput.value))) {
    btnCheckClickHandler();
  }
}

function checkInput(input) {
  return (
    typeof input !== "number" ||
    Number.isNaN(input) ||
    input >= globalVariable.maxNumber ||
    input <= globalVariable.minNumber
  );
}

export default inputChange;

// export default class inputChange extends app {
//   constructor() {
//     super();
//     console.log(this);
//   }

//   inputChangeHandler(e) {
//     const value = Number(e.target.value);

//     // invalid
//     if (this.checkInput(value)) {
//       guessInput.classList.add("guess__input--invalid");
//       btnGuessInput.classList.add("hidden--display");
//       guessOrder.textContent = "Invalid Number";
//       guessOrder.classList.add("guess__number--invalid");
//     }
//     // valid
//     else {
//       guessInput.classList.remove("guess__input--invalid");
//       btnGuessInput.classList.remove("hidden--display");
//       guessOrder.textContent = "Your Turn";
//       guessOrder.classList.remove("guess__number--invalid");
//     }
//   }

//   enterPressHandler(e) {
//     if (e.code === "Enter" && !this.checkInput(Number(guessInput.value))) {
//       this.btnCheckClickHandler();
//     }
//   }

//   checkInput(input) {
//     return (
//       typeof input !== "number" ||
//       Number.isNaN(input) ||
//       input >= this.maxNumber ||
//       input <= this.minNumber
//     );
//   }

//   addEventListener() {
//     guessInput.addEventListener("keypress", this.enterPressHandler.bind(this));

//     guessInput.addEventListener("input", this.inputChangeHandler.bind(this));
//   }
// }
