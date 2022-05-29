import { formInput, btnFormUserNameNext } from "../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import { nextFormPage } from "./formOrder.js";

function formUserName() {
  btnFormUserNameNext.addEventListener(
    "click",
    btnFormUserNameNextClickHandler.bind(null, formInput)
  );
}

function btnFormUserNameNextClickHandler(e) {
  globalVariable.userName = e.value;

  nextFormPage();
}

export default formUserName;
