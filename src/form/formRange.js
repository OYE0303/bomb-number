import globalVariable from "../globalVariable/globalVariable.js";
import {
  formRangeInput,
  guessInput,
  formOverlay,
  formRangeOutput,
  btnFormRangeNext,
} from "./../selector/selector.js";
import showContent from "../main/mainContent.js";

function formRange() {
  btnFormRangeNext.addEventListener("click", btnFormRangeNextClickHandler);

  formRangeInput.addEventListener("input", formRangeInputChangeHandler);
}
export default formRange;
export { formRangeInputChangeHandler };

function btnFormRangeNextClickHandler() {
  globalVariable.maxNumber = Number(formRangeInput.value);
  globalVariable.maxNumberNoChange = globalVariable.maxNumber;
  guessInput.setAttribute("max", String(globalVariable.maxNumberNoChange - 1));

  // start the game
  hideForm();
  showContent();
}

function formRangeInputChangeHandler() {
  formRangeOutput.textContent = formRangeInput.value;
}

function hideForm() {
  formOverlay.classList.add("hidden--display");
  globalVariable.formCollection.forEach((form) =>
    form.classList.add("hidden--display")
  );
}
