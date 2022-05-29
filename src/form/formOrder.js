import {
  btnFormLevelBack,
  btnFormCountryBack,
  btnFormRangeBack,
} from "./../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";

function formOrder() {
  btnFormLevelBack.addEventListener("click", backFormPage);
  btnFormCountryBack.addEventListener("click", backFormPage);
  btnFormRangeBack.addEventListener("click", backFormPage);
}

function nextFormPage() {
  globalVariable.formCollection[globalVariable.formOrder].classList.add(
    "hidden--display"
  );

  globalVariable.formCollection[++globalVariable.formOrder].classList.remove(
    "hidden--display"
  );
}

function backFormPage() {
  globalVariable.formCollection[globalVariable.formOrder].classList.add(
    "hidden--display"
  );

  globalVariable.formCollection[--globalVariable.formOrder].classList.remove(
    "hidden--display"
  );
}

export { nextFormPage, backFormPage };
export default formOrder;
