import {
  formLevelInputGroup,
  btnFormLevelNext,
  formLevelDescriptionCounts,
} from "../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import { nextFormPage } from "./formOrder.js";

function formLevel() {
  formLevelInputGroup.addEventListener("click", formInputLevelClickHandler);

  btnFormLevelNext.addEventListener("click", btnFormLevelNextClickHandler);
}

function formInputLevelClickHandler(e) {
  // note that e.target will select two element at the same time(input & level)
  // (1) find the elemet has data-id attribute
  const inputLevelDom = e.target.closest(".form__level__input");

  // (2) filter any possible outcome is null
  if (inputLevelDom) {
    formLevelDescriptionCounts.textContent = inputLevelDom.dataset.id;
    globalVariable.level = inputLevelDom.value;
  }
}

function btnFormLevelNextClickHandler() {
  // set tool counts based on level
  switch (globalVariable.level) {
    case "easy":
      globalVariable.userCountryInfo.toolCounts = 3;
      break;

    case "medium":
      globalVariable.userCountryInfo.toolCounts = 2;
      break;

    case "hard":
      globalVariable.userCountryInfo.toolCounts = 1;
      break;

    default:
      break;
  }

  nextFormPage();
}

export default formLevel;
