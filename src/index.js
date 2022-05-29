import inputChange from "./main/inputChange.js";
import formOrder from "./form/formOrder.js";
import formUserName from "./form/formUserName.js";
import formLevel from "./form/formLevel.js";
import formCountry from "./form/formCountry.js";
import formRange from "./form/formRange.js";
import btnCheckClick from "./guessNumber/btnCheckClick.js";
import useTool from "./tool/useTool.js";
import useToolSmall from "./tool/useToolSamll.js";
import showDiffToolUI from "./tool/showDiffToolUI.js";
import countryInfo from "./countryInfo/countryInfo.js";
import popupLevel from "./popup/popupLevel.js";
import popupQuestion from "./popup/popupQuestion.js";
import popupOverlayClick from "./popupOverlay/popupOverlayClick.js";
import closeAllPopup from "./popup/closeAllPopup.js";
import popupDiffQuestion from "./popup/popupDiffQuestion.js";
import popupUseTool from "./tool/popupUseTool.js";
import popupCantUseTool from "./tool/popupCantUseTool.js";
import popupComputerLoseGame from "./gameResult/popupComputerLoseGame.js";
import toolBtnToggle from "./tool/toolBtnToggle.js";
import "./style.css";

function app() {
  return [
    inputChange(),
    formOrder(),
    formUserName(),
    formLevel(),
    formCountry(),
    formRange(),
    btnCheckClick(),
    useTool(),
    useToolSmall(),
    showDiffToolUI(),
    countryInfo(),
    popupLevel(),
    popupQuestion(),
    popupOverlayClick(),
    closeAllPopup(),
    popupDiffQuestion(),
    popupUseTool(),
    popupCantUseTool(),
    popupComputerLoseGame(),
    toolBtnToggle(),
  ];
}

app();
