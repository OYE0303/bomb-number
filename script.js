import { DOM_SELECTION } from "./domSelection.js";
import { SVGIcon } from "./svgIcon.js";

const DOM = new DOM_SELECTION();
const SVG = new SVGIcon();

class APP {
  constructor() {
    this.allCountry;

    // NUMBER
    this.targetNumber;
    this.minNumber = 0;
    this.maxNumber = 200;

    // click toggle
    this.firstTimeTool = true;
    this.firstTimeMenu = true;

    // player order array
    this.currentOrder = 0;
    this.playerArr = [0, 1, 2, 3];

    // reverse
    this.reverse = false;
    this.myTurn = true;

    // init
    this.#addEventListener();
    // this.#countdown();
    this.#createTargetNumber();
    // this.#nextPlayerOrder();

    // this.#takeComputerGuessInput();
  }

  ///////////////////////////////////////
  // *** EVENT LISTENER ***
  ///////////////////////////////////////
  #addEventListener() {
    // this.#getAllCountryData();
    DOM.btnTool.addEventListener("click", this.#toolBtnToggle.bind(this));
    DOM.btnCountryInfoClose.addEventListener(
      "click",
      this.#closeCountryInfo.bind(this)
    );
    DOM.navCheckbox.addEventListener(
      "click",
      this.#menuCheckboxToggle.bind(this)
    );
    DOM.btnNavQuestion.addEventListener(
      "click",
      this.#showPopupQuestion.bind(this)
    );
    this.#addEventCountryInfo();

    for (let i = 0; i < DOM.btnPopupClose.length; i++) {
      DOM.btnPopupClose[i].addEventListener(
        "click",
        this.#closePopup.bind(this)
      );
    }

    // show level
    DOM.btnShowLevel.addEventListener("click", this.#showPopupLevel.bind(this));
    DOM.navSecond.addEventListener("click", this.#showPopupLevel.bind(this));

    // close level
    DOM.btnPopupLevelNo.addEventListener(
      "click",
      this.#closePopupLevel.bind(this)
    );

    // show different question(degelation)
    DOM.popupQuestion.addEventListener(
      "click",
      this.#showPopupDiffQuestion.bind(this)
    );

    // guess input
    DOM.btnGuessInput.addEventListener(
      "click",
      this.#takeGuessInput.bind(this)
    );

    // popup use tool
    DOM.btnToolUse.forEach((btn) =>
      btn.addEventListener("click", this.#showPopupUseTool.bind(this))
    );
    DOM.btnPopupUseToolNo.addEventListener(
      "click",
      this.#closePopupUseTool.bind(this)
    );
    DOM.btnPopupUseToolYes.addEventListener("click", this.#useTool.bind(this));

    DOM.btnToolQuestion.forEach((btn) =>
      btn.addEventListener("click", this.#showDiffToolUI.bind(this))
    );

    // can't use tool
    DOM.btnCantUseTool.addEventListener(
      "click",
      this.#closePopupCantUseTool.bind(this)
    );

    // form username
    DOM.btnForm.addEventListener("click", this.#takeInputName.bind(this));

    // form level
    DOM.formLevelInputGroup.addEventListener(
      "click",
      this.#showFormDiffLevel.bind(this)
    );
  }

  ///////////////////////////////////////
  // *** RANDOM NUMBER ***
  ///////////////////////////////////////
  #createRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ///////////////////////////////////////
  // *** CREATE TARGET NUMBER ***
  ///////////////////////////////////////
  #createTargetNumber() {
    this.targetNumber = this.#createRandomNumber(0, 200);
    console.log(this.targetNumber);
  }

  ///////////////////////////////////////
  // *** PROMISIFYING SETTIMEOUT ***
  ///////////////////////////////////////
  #timeout(second) {
    return new Promise(function time(resolve, reject) {
      setTimeout(resolve, second * 1000);
    });
  }

  ///////////////////////////////////////
  // *** COUNTDOWN ***
  ///////////////////////////////////////
  #countdown() {
    let i = 30;

    const time = setInterval(() => {
      if (i >= 10) DOM.countdownTime.textContent = `00:${i}`;
      else DOM.countdownTime.textContent = `00:0${i}`;
      i--;

      if (i < 0) {
        DOM.popupLoseDescription.textContent = `Because time is over`;
        DOM.popupLose.classList.remove("hiddenDisplay");
        DOM.popupOverlay.classList.remove("hiddenDisplay");
        clearInterval(time);
        DOM.countdownTime.textContent = `00:30`;
      }
    }, 1000);
  }

  ///////////////////////////////////////
  // *** CHECK ORDER AND UPDATE ***
  ///////////////////////////////////////
  // use this.reverse to check current order
  #checkOrderAndUpdate() {
    if (this.reverse) {
      this.#updateCounterClockwiseOrder();
      this.#updateOrderUI(this.currentOrder);
    } else {
      this.#updateClockwiseOrder();
      this.#updateOrderUI(this.currentOrder);
    }
  }

  ///////////////////////////////////////
  // *** TAKE TARGET NUMBER ***
  ///////////////////////////////////////
  // TODO check how to organize these two functions
  // this is only invoked when user submit input
  #takeGuessInput(e) {
    e.preventDefault();

    this.myTurn = false;

    // close "Your turn" UI
    this.#closePlayerOrderUI();

    // prevent user accidentally empty string
    // only use css to pretend there is no button
    // check css input button
    if (DOM.guessInput.value === "") return;

    // get input value
    const guessNumber = Number(DOM.guessInput.value);

    // check input again 1) is number 2) is inside valid range
    const checked = this.#checkInput(guessNumber);
    if (checked) {
      // wrong input UI
      this.#showPopupInvalidInput();
    }

    // guess the target number (game over)
    else if (guessNumber == this.targetNumber) {
      // game over UI
    }

    // correct input UI
    else {
      // guessNumber UI(pink & blue)
      this.#showGuessNumberUI(guessNumber);

      // wait for 5 second because the above animation is exactly 5 second
      this.#timeout(5)
        .then(() => {
          this.#showPassUI();
          this.#updateMinMaxRange(guessNumber);

          // wait another 3 second because showPassUI is exactly 3 second
          return this.#timeout(3);
        })
        .then(() => {
          this.#closeGuessNumberUI();
          this.#closePassUI();
        })
        .then(() => {
          // update next order(go to next player)
          this.#checkOrderAndUpdate();
        });
    }

    // close guess input
    // have to put here, or we cannot accept the user's input
    this.#closeGuessInput();
    DOM.guessInput.value = "";
  }

  #takeComputerGuessInput() {
    // can use tool

    // create random guessing number
    const guessNumber = this.#createComputerGuessingNumber(
      this.minNumber,
      this.maxNumber
    );

    if (guessNumber == this.targetNumber) {
      // another logic
    } else {
      // guessNumber UI
      this.#showGuessNumberUI(guessNumber);

      this.#timeout(5)
        .then(() => {
          this.#showPassUI();
          this.#updateMinMaxRange(guessNumber);

          return this.#timeout(3);
        })
        .then(() => {
          this.#closeGuessNumberUI();
          this.#closePassUI();
        })
        .then(() => {
          // update next order
          this.#checkOrderAndUpdate();
        });
    }
  }

  ///////////////////////////////////////
  // *** UPDATE MIN & MAX RANGE ***
  ///////////////////////////////////////
  #updateMinMaxRange(guessNumber) {
    // change max number and show UI
    if (guessNumber > this.targetNumber) {
      this.maxNumber = guessNumber;
      this.#showRangeNumberMaxUI(guessNumber);
    }

    // change min number and show UI
    else if (guessNumber < this.targetNumber) {
      this.minNumber = guessNumber;
      this.#showRangeNumberMinUI(guessNumber);
    }
  }

  ///////////////////////////////////////
  // *** CHECK INPUT ***
  ///////////////////////////////////////
  #checkInput(input) {
    return (
      typeof input !== "number" ||
      Number.isNaN(input) ||
      input > this.maxNumber ||
      input < this.minNumber
    );
  }

  ///////////////////////////////////////
  // *** UPDATE ORDER UI ***
  ///////////////////////////////////////
  #updateOrderUI(order) {
    // it's user's turn
    if (order === 0) {
      this.#showGuessInput();
      this.#showPlayerOrderUI("Your turn");

      this.myTurn = true;
    }
    // it's computer's turn
    else {
      this.#closePlayerOrderUI();

      // wait for computer's guessing(pretend computer is thinking(guessing))
      this.#waitComputerGuessingNumber(
        this.#showComputerWaitingUI.bind(this, `Player${order}`)
      );
    }
  }

  ///////////////////////////////////////
  // *** CLOCKWISE || COUNTERCLOCKWISE ***
  ///////////////////////////////////////
  #updateClockwiseOrder() {
    this.currentOrder++;

    if (this.currentOrder === 4) this.currentOrder = 0;
    return this.currentOrder;
  }

  #updateCounterClockwiseOrder() {
    this.currentOrder--;

    if (this.currentOrder === -1) this.currentOrder = 3;
    return this.currentOrder;
  }

  ///////////////////////////////////////
  // *** WAIT COMPUTER GUESSING NUMBER ***
  ///////////////////////////////////////
  #waitComputerGuessingNumber(cb1) {
    const randomTime = this.#createRandomNumber(3, 5);

    // this.#showComputerWaitingUI
    cb1();

    this.#timeout(randomTime).then(() => {
      // after waiting, do these two things
      this.#closeComputerWaitingUI();
      this.#takeComputerGuessInput();
    });
  }

  ///////////////////////////////////////
  // *** GUESS NUMBER UI ***
  ///////////////////////////////////////
  #showGuessNumberUI(number) {
    DOM.guessNumber.textContent = number;
    DOM.guessNumber.classList.remove("hiddenOpacity");
    DOM.guessNumber.classList.add("guess__number--animation");
  }

  #closeGuessNumberUI() {
    DOM.guessNumber.classList.add("hiddenOpacity");
    DOM.guessNumber.classList.remove("guess__number--animation");
  }

  #showPassUI() {
    DOM.guessNumber.textContent = "PASS";
    DOM.guessNumber.classList.add("pass--animation");
  }

  #closePassUI() {
    DOM.guessNumber.textContent = "";
    DOM.guessNumber.classList.remove("pass--animation");
  }

  ///////////////////////////////////////
  // *** RANGE NUMBER MIN & MAX UI ***
  ///////////////////////////////////////
  #showRangeNumberMinUI(min) {
    DOM.rangeNumberMin.textContent = min;
    DOM.rangeNumberMin.classList.add("range__number--animation");

    // remove animation class after animation
    this.#timeout(4).then(() =>
      DOM.rangeNumberMin.classList.remove("range__number--animation")
    );
  }

  #showRangeNumberMaxUI(max) {
    DOM.rangeNumberMax.textContent = max;
    DOM.rangeNumberMax.classList.add("range__number--animation");

    // remove animation class after animation
    this.#timeout(4).then(() =>
      DOM.rangeNumberMax.classList.remove("range__number--animation")
    );
  }

  ///////////////////////////////////////
  // *** POPUP INVAID INPUT ***
  ///////////////////////////////////////
  #showPopupInvalidInput() {
    this.#showPopupOverlay();
    DOM.popupInvalidInput.classList.remove("hiddenDisplay");

    this.#timeout(0).then(() =>
      DOM.popupInvalidInput.classList.remove("hiddenOpacity")
    );
  }

  ///////////////////////////////////////
  // *** SHOW GUESS INPUT ***
  ///////////////////////////////////////
  #showGuessInput() {
    DOM.guessInput.classList.remove("hiddenDisplay");
  }

  #closeGuessInput() {
    DOM.guessInput.classList.add("hiddenDisplay");
  }

  ///////////////////////////////////////
  // *** PLAYER ORDER UI ***
  ///////////////////////////////////////
  #showPlayerOrderUI(order) {
    DOM.guessOrder.textContent = order;
    DOM.guessOrder.classList.add("player--animation");
  }

  #closePlayerOrderUI() {
    DOM.guessOrder.textContent = "";
    DOM.guessOrder.classList.remove("player--animation");
  }

  ///////////////////////////////////////
  // *** COMPUTER WAITING UI ***
  ///////////////////////////////////////
  #showComputerWaitingUI(order) {
    DOM.guessOrder.textContent = order;
    DOM.guessOrder.classList.add("computer--animation");
  }

  #closeComputerWaitingUI() {
    DOM.guessOrder.textContent = "";
    DOM.guessOrder.classList.remove("computer--animation");
  }

  ///////////////////////////////////////
  // *** COMPUTER GUESSING NUMBER ***
  ///////////////////////////////////////
  #createComputerGuessingNumber(min, max) {
    return this.#createRandomNumber(min + 1, max - 1);
  }

  ///////////////////////////////////////
  // *** GET API DATA ***
  ///////////////////////////////////////
  async #getAllCountryData() {
    const res = await fetch("https://restcountries.eu/rest/v2/all");
    const data = await res.json();
    this.allCountry = data;
  }

  ///////////////////////////////////////
  // *** CREATE HTML ***
  ///////////////////////////////////////
  #getRandomCountry() {
    const randomNumber = this.#createRandomNumber(0, this.allCountry.length);
  }

  #createCountryHTML(data, country = "", player, playerOverlay) {
    console.log(data);
    const htmlImg = `        
          <img class="country__img" src="${data.flag}" />`;

    const htmlCountryName = `<p class = "country__name">${data.name}</p>`;

    playerOverlay.insertAdjacentHTML("afterbegin", htmlCountryName);
    player.insertAdjacentHTML("beforeend", htmlImg);
  }

  ///////////////////////////////////////
  // *** TOOL ***
  ///////////////////////////////////////
  #showTool() {
    DOM.toolContainer.classList.remove("hiddenDisplay");

    DOM.toolItem.forEach(function rmToolItemHidden(element) {
      element.classList.remove("hiddenDisplay");
    });

    this.#timeout(0)
      .then(() => {
        document.querySelector(".tool__container").style.height = "20rem";

        DOM.toolContainer.classList.remove("hiddenOpacity");
      })
      .then(() => {
        DOM.toolItem.forEach(function rmToolItemHidden(element) {
          element.classList.remove("hiddenOpacity");
        });
      });
  }

  #closeTool() {
    DOM.toolContainer.style.height = "0";

    DOM.toolContainer.classList.add("hiddenOpacity");

    DOM.toolItem.forEach(function rmToolItemHidden(element) {
      element.classList.add("hiddenOpacity");
    });
  }

  #toolBtnToggle() {
    if (this.firstTimeTool) {
      this.#showTool();
      this.firstTimeTool = false;
    } else {
      this.#closeTool();
      this.firstTimeTool = true;
    }
  }

  ///////////////////////////////////////
  // *** COUNTRY INFO ***
  ///////////////////////////////////////
  #showCountryInfo() {
    DOM.countryInfo.classList.remove("hiddenDisplay");

    this.#timeout(0).then(() =>
      DOM.countryInfo.classList.remove("hiddenOpacity")
    );
  }

  #closeCountryInfo() {
    document.querySelector(".countryInfo").classList.add("hiddenDisplay");

    this.#timeout(0).then(() =>
      document.querySelector(".countryInfo").classList.add("hiddenOpacity")
    );
  }

  #addEventCountryInfo() {
    DOM.btnInfo[0].addEventListener("click", this.#showCountryInfo.bind(this));
    DOM.btnInfo[1].addEventListener("click", this.#showCountryInfo.bind(this));
    DOM.btnInfo[2].addEventListener("click", this.#showCountryInfo.bind(this));
    DOM.btnInfo[3].addEventListener("click", this.#showCountryInfo.bind(this));
    // DOM.btnInfo.forEach(function (btn) {
    //   console.log(btn);
    //   btn.addEventListener("click", this.#showCountryInfo.bind(this));
    // });
  }

  ///////////////////////////////////////
  // *** MENU BACKGROUND ***
  ///////////////////////////////////////
  #showMenuBackground() {
    DOM.navBackground.classList.remove("hiddenDisplay");

    DOM.btnNavBackground.forEach(function rmToolItemHidden(element) {
      element.classList.remove("hiddenDisplay");
    });

    this.#timeout(0)
      .then(() => {
        DOM.navBackground.style.height = "100vh";

        DOM.navBackground.classList.remove("hiddenOpacity");
      })
      .then(() =>
        DOM.btnNavBackground.forEach(function rmToolItemHidden(element) {
          element.classList.remove("hiddenOpacity");
        })
      );
  }

  #closeMenuBackground() {
    DOM.navBackground.style.height = "1vh";

    DOM.navBackground.classList.add("hiddenOpacity");

    this.#timeout(0)
      .then(() =>
        DOM.btnNavBackground.forEach(function rmToolItemHidden(element) {
          element.classList.add("hiddenOpacity");
        })
      )
      .then(() => {
        DOM.navBackground.classList.add("hiddenDisplay");

        DOM.btnNavBackground.forEach(function rmToolItemHidden(element) {
          element.classList.add("hiddenDisplay");
        });
      });
  }

  #menuCheckboxToggle() {
    if (this.firstTimeMenu) {
      this.#showMenuBackground();
      this.firstTimeMenu = false;
    } else {
      this.#closeMenuBackground();
      this.firstTimeMenu = true;
    }
  }

  ///////////////////////////////////////
  // *** POPUP OVERLAY ***
  ///////////////////////////////////////
  #showPopupOverlay() {
    DOM.popupOverlay.classList.remove("hiddenDisplay");
  }

  #closePopupOverlay() {
    DOM.popupOverlay.classList.add("hiddenDisplay");
  }

  ///////////////////////////////////////
  // *** CLOSE ALL POP UP ***
  ///////////////////////////////////////
  // add one callback function to different close button
  // use .closest to check what popup should close
  #closePopup(e) {
    const targetElement = e.target;

    this.#closePopupOverlay();
    // targetElement.closest(".popup__overlay").classList.add("hiddenDisplay");

    // question
    if (targetElement.closest(".popup__question")) {
      targetElement
        .closest(".popup__question")
        .classList.toggle("hiddenDisplay");
      targetElement
        .closest(".popup__question")
        .classList.toggle("hiddenOpacity");
    }

    // rule
    if (targetElement.closest(".popup__rule")) {
      targetElement.closest(".popup__rule").classList.toggle("hiddenDisplay");
      // targetElement.closest(".popup__rule").classList.toggle("hiddenOpacity");
    }

    // diff level
    if (targetElement.closest(".popup__diffLevel")) {
      targetElement
        .closest(".popup__diffLevel")
        .classList.toggle("hiddenDisplay");
      // targetElement
      //   .closest(".popup__diffLevel")
      //   .classList.toggle("hiddenOpacity");
    }

    // tool
    if (targetElement.closest(".popup__tool")) {
      targetElement.closest(".popup__tool").classList.toggle("hiddenDisplay");
      // targetElement.closest(".popup__tool").classList.toggle("hiddenOpacity");
    }
  }

  ///////////////////////////////////////
  // *** POPUP LEVEL ***
  ///////////////////////////////////////
  #showPopupLevel(e) {
    if (e.target.classList.contains("btn__level")) {
      this.#showPopupOverlay();

      DOM.popupLevel.classList.remove("hiddenDisplay");

      this.#timeout(0).then(() => {
        DOM.popupLevel.classList.remove("hiddenOpacity");
      });
    }
  }

  #closePopupLevel() {
    this.#closePopupOverlay();

    DOM.popupLevel.classList.add("hiddenDisplay");
    DOM.popupLevel.classList.add("hiddenOpacity");
  }

  ///////////////////////////////////////
  // *** POPUP QUESTION ***
  ///////////////////////////////////////
  #showPopupQuestion() {
    this.#showPopupOverlay();
    DOM.popupQuestion.classList.remove("hiddenDisplay");

    this.#timeout(0).then(() =>
      DOM.popupQuestion.classList.remove("hiddenOpacity")
    );
  }

  ///////////////////////////////////////
  // *** POPUP DIFFERENT QUESTION (RULE, LEVEL, TOOL) ***
  ///////////////////////////////////////
  // use one callback function attach on one question pop up
  // use .containes to check what button is user currently clicking
  #showPopupDiffQuestion(e) {
    const targetElement = e.target;
    if (targetElement.classList.contains("btn__popup__question")) {
      DOM.popupQuestion.classList.add("hiddenDisplay");
      DOM.popupQuestion.classList.add("hiddenOpacity");

      if (targetElement.classList.contains("btn__popup__question__rule")) {
        DOM.popupRule.classList.remove("hiddenDisplay");
      }

      if (targetElement.classList.contains("btn__popup__question__diffLevel")) {
        DOM.popupDiffLevel.classList.remove("hiddenDisplay");
      }

      if (targetElement.classList.contains("btn__popup__question__tool")) {
        DOM.popupTool.classList.remove("hiddenDisplay");
      }
    }
  }

  ///////////////////////////////////////
  // *** POPUP USE ASSIGN ***
  ///////////////////////////////////////
  // TODO think how to organize
  #showPopupAssignUI() {
    let result;

    if (this.reverse) result = [2, 3, 4];
    else result = [0, 1, 2];

    return `
    <h5 class = "popup__assign__subTitle">
      Which player <br />
      do you want to assign?
    </h5>
    <select class="popup__assign__select" id="assign">
      <option value="${result[0]}">player1</option>
      <option value="${result[1]}">player2</option>
      <option value="${result[2]}">player3</option>
    </select>
    `;
  }

  ///////////////////////////////////////
  // *** POPUP USE TOOL ***
  ///////////////////////////////////////
  // TODO (think how to organize the code)
  #showPopupUseTool(e) {
    this.#showPopupOverlay();

    if (this.myTurn) {
      DOM.popupUseTool.classList.remove("hiddenDisplay");

      if (e.target.closest(".btn__tool--use").dataset.id === "assign") {
        DOM.popupUseToolTitle.insertAdjacentHTML(
          "afterend",
          this.#showPopupAssignUI()
        );
        DOM.popupUseToolTitle.insertAdjacentHTML("afterend", SVG.assign);

        // font size of description smaller
        // because UI of assign is more
        DOM.popupUseToolDescription.style.fontSize = "1.5rem";
      }

      if (e.target.closest(".btn__tool--use").dataset.id === "pass")
        DOM.popupUseToolTitle.insertAdjacentHTML("afterend", SVG.pass);

      if (e.target.closest(".btn__tool--use").dataset.id === "uturn")
        DOM.popupUseToolTitle.insertAdjacentHTML("afterend", SVG.uturn);

      this.#timeout(0).then(() =>
        DOM.popupUseTool.classList.remove("hiddenOpacity")
      );
    } else {
      DOM.popupCantUseTool.classList.remove("hiddenDisplay");

      this.#timeout(0).then(() =>
        DOM.popupCantUseTool.classList.remove("hiddenOpacity")
      );
    }
  }

  #closePopupUseTool() {
    DOM.popupUseTool.classList.add("hiddenOpacity");
    DOM.popupUseToolDescription.style.fontSize = "2rem";

    this.#timeout(0).then(() => {
      this.#closePopupOverlay();
      DOM.popupUseTool.classList.add("hiddenDisplay");
    });

    // remove the svg icon in every time closing
    // can't use DOM.popupUseToolIcon
    // because there is no html element at the time we invoking the DOM_SELECTION
    // so DOM.popupUseToolIcon === null
    document.querySelector(".popup__useTool__icon").remove();

    // also remove assign UI
    // have to first check if element exist
    document.querySelector(".popup__assign__subTitle") !== null &&
      document.querySelector(".popup__assign__subTitle").remove();
    document.querySelector(".popup__assign__select") !== null &&
      document.querySelector(".popup__assign__select").remove();
  }

  ///////////////////////////////////////
  // *** SHOW USE TOOL UI ***
  ///////////////////////////////////////
  #showUseToolUI(tool, player) {
    // set simple html
    const useToolHTML = `use ${tool}`;

    // show html on UI
    DOM.guessUseToolUserName.textContent = `player${player}`;
    DOM.guessUseTool.textContent = useToolHTML;

    // close popup
    this.#closePopupUseTool();

    // add class for animation
    DOM.guessUseToolUserName.classList.add("guess__useTool--animation");
    DOM.guessUseTool.classList.add("guess__useTool--animation");
  }

  #closeUseToolUI() {
    DOM.guessUseToolUserName.textContent = "";
    DOM.guessUseTool.textContent = "";
    DOM.guessUseToolUserName.classList.remove("guess__useTool--animation");
    DOM.guessUseTool.classList.remove("guess__useTool--animation");
  }

  #useTool(e) {
    // close "Your turn" UI
    this.#closePlayerOrderUI();

    // close tool UI
    this.#toolBtnToggle();

    // not my turn anymore
    this.myTurn = false;

    // get the current player and used tool
    const player = this.currentOrder;
    const tool = e.target
      .closest(".popup__useTool")
      .querySelector(".popup__useTool__icon").dataset.id;

    this.#timeout(0)
      .then(() => {
        this.#whichTool(tool);
      })
      .then(() => {
        this.#showUseToolUI(tool, player);

        return this.#timeout(3);
      })
      .then(() => {
        // later, close whole UI
        this.#closeUseToolUI();
        this.#checkOrderAndUpdate();
      });
  }

  ///////////////////////////////////////
  // *** WHICH TOOL ***
  ///////////////////////////////////////
  #whichTool(tool) {
    if (tool === "PASS") {
    } else if (tool === "U-TURN") {
      this.reverse = !this.reverse;
    } else {
      this.currentOrder = document.querySelector(
        ".popup__assign__select"
      ).value;
    }
  }

  ///////////////////////////////////////
  // *** TOOL EXTENSION BTN ***
  ///////////////////////////////////////
  #showDiffToolUI() {
    this.#showPopupOverlay();
    DOM.popupTool.classList.remove("hiddenDisplay");

    // close tool btn UI
    // this.#toolBtnToggle();
  }

  ///////////////////////////////////////
  // *** POP UP CAN'T USE TOOL ***
  ///////////////////////////////////////
  #showPopupCantUseTool() {
    this.#showPopupOverlay();
    DOM.popupCantUseTool.classList.remove("hiddenDisplay");

    this.#timeout(0).then(() =>
      DOM.popupCantUseTool.classList.remove("hiddenOpacity")
    );
  }

  #closePopupCantUseTool() {
    this.#closePopupOverlay();
    DOM.popupCantUseTool.classList.add("hiddenDisplay");
    DOM.popupCantUseTool.classList.add("hiddenOpacity");
  }

  ///////////////////////////////////////
  // *** FORM ***
  ///////////////////////////////////////
  #takeInputName() {
    console.log(DOM.formInput.value);
  }

  ///////////////////////////////////////
  // *** FORM LEVEL***
  ///////////////////////////////////////
  #showFormDiffLevel(e) {
    // note that e.target will select two element at the same time(input & level)
    // (1) find the elemet has data-id attribute
    const level = e.target.closest(".form__level__radio--input");

    // (2) filter any possible outcome is null
    if (level) {
      DOM.formLevelDescriptionCounts.textContent = level.dataset.id;
    }
  }
}

const app = new APP();
