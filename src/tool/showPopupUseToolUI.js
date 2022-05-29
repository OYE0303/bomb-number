import {
  popupUseToolTitle,
  popupUseTool,
  popupUseToolDescription,
} from "./../selector/selector.js";
import wait from "../utils/wait.js";
import globalVariable from "../globalVariable/globalVariable.js";
import SVG from "./../others/svgIcon.js";

function showPopupUseToolUI(tool) {
  // assign
  if (tool === "ASSIGN") {
    popupUseToolTitle.insertAdjacentHTML("afterend", showPopupAssignUI());
    popupUseToolTitle.insertAdjacentHTML("afterend", SVG.assign);

    // font size of description smaller
    // because UI of assign is more
    popupUseToolDescription.style.fontSize = "2rem";
  }

  // pass
  if (tool === "PASS")
    popupUseToolTitle.insertAdjacentHTML("afterend", SVG.pass);

  // uturn
  if (tool === "U-TURN")
    popupUseToolTitle.insertAdjacentHTML("afterend", SVG.uturn);

  wait(0).then(() => popupUseTool.classList.remove("hidden--opacity"));
}

export default showPopupUseToolUI;

function showPopupAssignUI() {
  // get current number of player (exclude user player)
  const currentPlayerNumber = globalVariable.allPlayerArr.length - 1;
  let result;

  /*
      Why [2,3,4] and [0,1,2]
      note that later it will add or subtract 1 after checkOrderAndUpdate()
      In reverse order, subtract 1
      [2,3,4] -> [1,2,3]
      In non-reverse order, add 1
      [0,1,2] -> [1,2,3]
      Note player can only assign computer player which is [1,2,3]
      */
  if (globalVariable.reverse) result = [2, 3, 4];
  else result = [0, 1, 2];

  // removing element from result array while this.allPlayerArr decrease too
  while (currentPlayerNumber !== result.length) {
    result.pop();
  }

  let html = `
      <h5 class = "popup__subtitle--assign">
        Which player <br />
        do you want to assign?
      </h5>
      <select class="popup__assign__select text--cap" id="assign">
      `;

  for (let i = 0; i < result.length; i++) {
    html += `<option value="${result[i]}">${
      globalVariable.allPlayerArr[i + 1].countryName
    }(${globalVariable.allPlayerArr[i + 1].position})</option>
        `;
  }

  html += `</select>`;

  return html;
}
