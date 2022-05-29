import { guessUseTool, guessUseToolUserName } from "./../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import { closePopupUseTool } from "./popupUseTool.js";
import SVG from "./../others/svgIcon.js";

function showUseToolUI(tool, player) {
  // re-position based on the length of county name
  if (player.length >= 20) {
    guessUseTool.style.top = "78%";
    guessUseToolUserName.style.top = "43%";
  } else guessUseTool.style.top = "55%";

  // set tool html and icon
  const useToolHTML = `use ${tool}`;
  const toolIcon =
    tool === "ASSIGN"
      ? SVG.assignImg
      : tool === "PASS"
      ? SVG.passImg
      : SVG.uturnImg;

  // show tool html and icon on UI
  guessUseToolUserName.textContent = `${player}`;
  guessUseTool.textContent = useToolHTML;
  guessUseTool.insertAdjacentHTML("beforeend", toolIcon);

  // close popup (only need to close if it's user using the tool)
  if (player === globalVariable.userCountryInfo.countryName)
    closePopupUseTool();

  // add class for animation
  guessUseToolUserName.classList.add("guess__tool--animation");
  guessUseTool.classList.add("guess__tool--animation");
}

function closeUseToolUI() {
  /*
    have to first remove the tool icon, then empty the text content(guessUseTool)
    because tool icon is inside the guessUseTool <p>  <svg></svg> </p>
    */
  guessUseTool.removeChild(document.querySelector(".guess__tool__icon"));
  guessUseToolUserName.classList.remove("guess__tool--animation");
  guessUseTool.classList.remove("guess__tool--animation");
  guessUseToolUserName.textContent = "";
  guessUseTool.textContent = "";
}

export { showUseToolUI, closeUseToolUI };
