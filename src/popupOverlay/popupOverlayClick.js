import { popupOverlay } from "../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import { closePopupLevel } from "../popup/popupLevel.js";
import { closePopupQuestion } from "../popup/popupQuestion.js";
import { closePopupUseTool } from "./../tool/popupUseTool.js";
import { closePopupCantUseTool } from "./../tool/popupCantUseTool.js";
import closeToolPopup from "../tool/closeToolPopup.js";

function popupOverlayClick() {
  popupOverlay.addEventListener("click", popupOverlayClickHandler);
}

export default popupOverlayClick;

function popupOverlayClickHandler(e) {
  if (!e.target.classList.contains("popup__overlay")) {
    return;
  }

  switch (globalVariable.popupOpening) {
    case "level": {
      closePopupLevel();
      break;
    }

    case "question": {
      closePopupQuestion();
      break;
    }

    case "useTool": {
      closePopupUseTool();
      break;
    }

    case "cantUseTool": {
      closePopupCantUseTool();
      break;
    }

    case "tool": {
      closeToolPopup();
      break;
    }

    default:
      break;
  }
}
