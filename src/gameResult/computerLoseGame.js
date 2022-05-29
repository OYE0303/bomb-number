import { remaingCounts } from "../selector/selector.js";
import globalVariable from "../globalVariable/globalVariable.js";
import { showPopupComputerLoseGame } from "./popupComputerLoseGame.js";

function computerLoseGame() {
  // blur lose image
  blurCountryImg();

  // show popup UI

  showPopupComputerLoseGame();

  // add user tool counts
  globalVariable.userCountryInfo.toolCounts++;

  // show remaining counts of tool
  remaingCounts.forEach(
    (count) => (count.textContent = globalVariable.userCountryInfo.toolCounts)
  );
}

export default computerLoseGame;

function blurCountryImg() {
  const losingCountryOrder =
    globalVariable.allPlayerArr[globalVariable.currentOrder].order;

  /*
    <main class="content">
    ...
    <div class="player--main"></div>
    <div class="player--1"></div>
    <div class="player--2"></div>
    <div class="player--3"></div>
    </main>
    */
  const contentChildren = Array.from(
    document.querySelector(".content").children
  );

  const losingPlayer = contentChildren.find((child) =>
    child.classList.contains(`player--${losingCountryOrder}`)
  );

  losingPlayer.classList.add("country__img--lose");
}
