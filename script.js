import { DOM__SELECTION } from "./domSelection.js";
import { SVG__ICON } from "./svgIcon.js";
import { PLAYER__INFO } from "./playerInfo.js";

const DOM = new DOM__SELECTION();
const SVG = new SVG__ICON();

class APP {
  constructor() {
    // PLAYER INFO
    this.userCountryInfo = new PLAYER__INFO();
    this.Computer1CountryInfo = new PLAYER__INFO();
    this.Computer2CountryInfo = new PLAYER__INFO();
    this.Computer3CountryInfo = new PLAYER__INFO();

    // FORM ARRAY & ORDER
    this.formCollection = Array.from(
      document.querySelectorAll(".form__container")
    );
    this.formOrder = 0;

    // USERNAME
    this.userName;

    // LEVEL
    this.level;

    // NUMBER
    this.targetNumber;
    this.minNumber = 0;
    this.maxNumber;
    this.maxNumberNoChange;

    // CLICK TOGGLE
    this.firstTimeTool = true;
    this.firstTimeMenu = true;

    // PLAYER ORDER ARRAY
    this.allPlayerArr = [
      this.userCountryInfo,
      this.Computer1CountryInfo,
      this.Computer2CountryInfo,
      this.Computer3CountryInfo,
    ];
    this.allPlayerArrNoChange = [...this.allPlayerArr]; // for country info

    // REVERSE & ORDER
    this.reverse = false;
    this.currentOrder = 0;
    this.myTurn = true;

    // COUNT DOWN (for clearSettimeInterval)
    this.countDown;

    // EVENT LISTENER
    this.#addEventListener();
  }

  ///////////////////////////////////////
  // *** EVENT LISTENER ***
  ///////////////////////////////////////
  #addEventListener() {
    // TOOL
    DOM.btnTool.addEventListener("click", this.#toolBtnToggle.bind(this));
    DOM.toolItemName.forEach((toolName) =>
      toolName.addEventListener("click", this.#useToolSmall.bind(this))
    );

    // COUNTRY INFO
    DOM.btnCountryInfoClose.addEventListener(
      "click",
      this.#closeCountryInfo.bind(this)
    );

    // NAV CHECKBOX & BACKGROUND
    DOM.btnNavBackground.forEach((btnNav) =>
      btnNav.addEventListener("click", this.#showPopupLevelSmall.bind(this))
    );
    DOM.btnNavBackGroundFaq.addEventListener(
      "click",
      this.#showPopupQuestionSmall.bind(this)
    );
    DOM.navCheckbox.addEventListener(
      "click",
      this.#menuCheckboxToggle.bind(this)
    );
    DOM.btnNavQuestion.addEventListener(
      "click",
      this.#showPopupQuestion.bind(this)
    );

    // COUNTRY INFO (SIDE WINDOW)
    DOM.btnInfo.forEach((btn) =>
      btn.addEventListener("click", this.#showCountryInfo.bind(this))
    );

    // POP UP
    DOM.btnPopupClose.forEach((btnClose) =>
      btnClose.addEventListener("click", this.#closePopup.bind(this))
    );

    // POPUP CURRENT LEVEL
    DOM.btnShowLevel.addEventListener("click", this.#showPopupLevel.bind(this));
    DOM.navSecond.addEventListener("click", this.#showPopupLevel.bind(this));
    DOM.btnPopupLevelNo.addEventListener(
      "click",
      this.#closePopupLevel.bind(this)
    );

    // POPUP CHANGE LEVEL
    DOM.btnPopupLevelYes.addEventListener(
      "click",
      this.#changeLevel.bind(this)
    );

    // POPUP QUESTION
    DOM.popupQuestion.addEventListener(
      "click",
      this.#showPopupDiffQuestion.bind(this)
    );

    // TAKE USER'S GUESS INPUT
    DOM.btnGuessInput.addEventListener(
      "click",
      this.#checkGuessInput.bind(this)
    );

    // USE TOOL
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

    // POPUP INVALID INPUT
    DOM.btn__invalidInput.addEventListener(
      "click",
      this.#closePopupInvalidInput.bind(this)
    );

    // POPUP CANT USE TOOL
    DOM.btnCantUseTool.addEventListener(
      "click",
      this.#closePopupCantUseTool.bind(this)
    );

    // COMPUTER LOSE GAME
    DOM.btnPopupComputerLoseGame.addEventListener(
      "click",
      this.#closePopupComputerLoseGame.bind(this)
    );

    // form username
    DOM.btnFormUserNameNext.addEventListener(
      "click",
      this.#takeInputName.bind(this)
    );

    // FORM LEVEL
    DOM.formLevelInputGroup.addEventListener(
      "click",
      this.#showFormDiffLevel.bind(this)
    );
    DOM.btnFormLevelNext.addEventListener(
      "click",
      this.#takeInputDiffLevel.bind(this)
    );
    DOM.btnFormLevelBack.addEventListener(
      "click",
      this.#backFormPage.bind(this)
    );

    // form country
    DOM.formCountryRegionSelect.addEventListener(
      "input",
      this.#takeFormCountryRegionSelect.bind(this)
    );
    DOM.formCountryNameSelect.addEventListener(
      "input",
      this.#setCountryName.bind(this)
    );
    DOM.btnFormCountryNext.addEventListener(
      "click",
      this.#takeFormCountryNameSelect.bind(this)
    );
    DOM.btnFormCountryBack.addEventListener(
      "click",
      this.#backFormPage.bind(this)
    );

    // form range
    DOM.btnFormRangeNext.addEventListener(
      "click",
      this.#takeFormRange.bind(this)
    );
    DOM.btnFormRangeBack.addEventListener(
      "click",
      this.#backFormPage.bind(this)
    );

    // CHECK RULE
    DOM.btnFormCheckRule.addEventListener(
      "click",
      this.#showCheckRule.bind(this)
    );

    this.#showComputerWaitingUI();
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
    this.targetNumber = this.#createRandomNumber(1, this.maxNumber - 1);
  }

  ///////////////////////////////////////
  // *** DELETE ELEMENT FROM ARRAY ***
  ///////////////////////////////////////
  #deleteElementFromArray(arr, element) {
    return arr.filter((el) => el !== element);
  }

  ///////////////////////////////////////
  // *** PROMISIFYING SETTIMEOUT ***
  ///////////////////////////////////////
  #timeout(second) {
    return new Promise(function time(resolve) {
      setTimeout(resolve, second * 1000);
    });
  }

  ///////////////////////////////////////
  // *** COUNTDOWN ***
  ///////////////////////////////////////
  #showCountdown() {
    let i = 30;
    DOM.countdownTime.style.color = "var(--white-light)";
    DOM.countdownTime.textContent = `00:30`;
    this.countDown = setInterval(() => {
      if (i >= 10) {
        DOM.countdownTime.textContent = `00:${i}`;
      } else {
        DOM.countdownTime.textContent = `00:0${i}`;
        DOM.countdownTime.style.color = "var(--pink)";
      }
      i--;
      if (i < 0) {
        this.#checkGuessInput(null, true);
        clearInterval(this.countDown);
        DOM.countdownTime.textContent = ``;
      }
    }, 1000);
  }

  #closeCountDown() {
    clearInterval(this.countDown);
    DOM.countdownTime.textContent = ``;
  }

  ///////////////////////////////////////
  // *** SET COUNTRY INFO ***
  ///////////////////////////////////////
  #setCountryInfo(player, order, toolCounts, data, position) {
    player.order = order;
    player.toolCounts = toolCounts;
    player.countryData = data;
    player.position = position;
  }

  ///////////////////////////////////////
  // *** FORM ORDER***
  ///////////////////////////////////////
  #nextFormPage() {
    this.formCollection[this.formOrder].classList.add("hiddenDisplay");

    this.formOrder++;
    this.formCollection[this.formOrder].classList.remove("hiddenDisplay");
  }

  #backFormPage() {
    this.formCollection[this.formOrder].classList.add("hiddenDisplay");

    this.formOrder--;
    this.formCollection[this.formOrder].classList.remove("hiddenDisplay");
  }

  ///////////////////////////////////////
  // *** FORM ***
  ///////////////////////////////////////
  #takeInputName() {
    this.userName = DOM.formInput.value;

    this.#nextFormPage();
  }

  ///////////////////////////////////////
  // *** FORM LEVEL***
  ///////////////////////////////////////
  #showFormDiffLevel(e) {
    // note that e.target will select two element at the same time(input & level)
    // (1) find the elemet has data-id attribute
    const level = e.target.closest(".form__level__input");

    console.log(level);
    // (2) filter any possible outcome is null
    if (level) {
      DOM.formLevelDescriptionCounts.textContent = level.dataset.id;
    }
  }

  #takeInputDiffLevel() {
    DOM.formLevelInput.forEach((el) => {
      if (el.checked) this.level = el.value;
    });

    // set tool counts based on level
    if (this.level === "easy") this.userCountryInfo.toolCounts = 3;
    else if (this.level === "medium") this.userCountryInfo.toolCounts = 2;
    else this.userCountryInfo.toolCounts = 1;

    this.#nextFormPage();
  }

  ///////////////////////////////////////
  // *** FORM COUNTRY ***
  ///////////////////////////////////////
  async #takeFormCountryRegionSelect() {
    // get input value(which region)
    const region = DOM.formCountryRegionSelect.value;

    // convert children to array
    const CountryNameChildren = Array.from(DOM.formCountryNameSelect.children);

    // if selected before, delete original one
    this.#deleteFormCountryName(CountryNameChildren);

    // if slected before, and select random again, then set random back
    if (region === "Random" && CountryNameChildren.length !== 1) {
      DOM.formCountryNameSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="Random">(Random)</option>`
      );

      DOM.formCountryImg.classList.remove("form__country__img--animation");
      return;
    }

    const countryData = await this.getRegionCountryData(region);

    this.#showFormCountryName(countryData);

    this.#showFormCountryImg(countryData[0]);
  }

  async #takeFormCountryNameSelect() {
    // if user randomly choose country
    if (DOM.formCountryNameSelect.value === "Random") {
      const countryName = await this.#randomlyChooseUserCountryName();
      this.userCountryInfo.countryName = countryName;
    }
    // set country info (name)
    else this.userCountryInfo.countryName = DOM.formCountryNameSelect.value;

    this.#nextFormPage();

    // show form range UI
    this.#showFormRange();
  }

  #setCountryName() {
    const countryName = DOM.formCountryNameSelect.value;
    this.#showFormCountryImg(countryName);
  }

  #deleteFormCountryName(childrenArr) {
    childrenArr.forEach((child) => DOM.formCountryNameSelect.remove(child));
  }

  #generateFormCountryNameOptionHtml(countryNameArr) {
    let html = ``;
    countryNameArr.forEach(
      (country) => (html += `<option>${country}</option>`)
    );

    return html;
  }

  #showFormCountryName(countryNameArr) {
    const html = this.#generateFormCountryNameOptionHtml(countryNameArr);
    console.log(html);
    DOM.formCountryNameSelect.insertAdjacentHTML("beforeend", html);
  }

  async #showFormCountryImg(country) {
    // hidden the image
    DOM.formCountryImg.classList.add("hidden");

    // show the loading
    DOM.formCountryRegion.insertAdjacentHTML(
      "beforeend",
      `<div class="form__country__loading" ></div>`
    );

    const countryFlag = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );

    // remove the loading
    document.querySelector(".form__country__loading").remove();

    // remove the hidden of hidden
    DOM.formCountryImg.classList.remove("hidden");

    // nice
    const [
      {
        flags: { svg: data },
      },
    ] = await countryFlag.json();

    DOM.formCountryImg.src = data;
    DOM.formCountryImg.classList.add("form__country__img--animation");
  }

  ///////////////////////////////////////
  // *** FORM RANGE***
  ///////////////////////////////////////
  #takeFormRange() {
    this.maxNumber = Number(DOM.formRangeInput.value);
    this.maxNumberNoChange = this.maxNumber;

    // start the game
    this.#hideForm();
    this.#showContent();
  }

  #showFormRange() {
    DOM.formRangeOutput.textContent = DOM.formRangeInput.value;

    DOM.formRangeInput.addEventListener("input", function () {
      DOM.formRangeOutput.textContent = DOM.formRangeInput.value;
    });
  }

  ///////////////////////////////////////
  // *** COUNTRY DATA (USER & COMPUTER)***
  ///////////////////////////////////////
  async #showUserCountryImg() {
    const countryName = this.userCountryInfo.countryName;
    const countryData = await this.#getOneCountryData(countryName);

    // set user country info
    this.userCountryInfo.order = 0;
    this.userCountryInfo.countryData = countryData;

    this.#createCountryHTMLAndShowUI(
      countryData,
      DOM.playerMain,
      DOM.playerOverlayMain
    );
  }

  async #showComputerCountryImg() {
    const countryNameArr = await this.#randomlyChooseCountryName();

    for (let i = 0; i < countryNameArr.length; i++) {
      const countryData = await this.#getOneCountryData(countryNameArr[i]);
      console.log(countryData);

      // set computer country data, and show img UI
      if (i == 0) {
        this.#setCountryInfo(
          this.Computer1CountryInfo,
          1,
          3,
          countryData,
          "left"
        );

        this.#createCountryHTMLAndShowUI(
          countryData,
          DOM.player1,
          DOM.playerOverlay1
        );
      } else if (i == 1) {
        this.#setCountryInfo(
          this.Computer2CountryInfo,
          2,
          3,
          countryData,
          "top"
        );

        this.#createCountryHTMLAndShowUI(
          countryData,
          DOM.player2,
          DOM.playerOverlay2
        );
      } else {
        this.#setCountryInfo(
          this.Computer3CountryInfo,
          3,
          3,
          countryData,
          "right"
        );

        this.#createCountryHTMLAndShowUI(
          countryData,
          DOM.player3,
          DOM.playerOverlay3
        );
      }
    }
  }

  ///////////////////////////////////////
  // *** GET API DATA ***
  ///////////////////////////////////////
  async getRegionCountryData(region) {
    const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);

    const data = await res.json();

    // data is an array containing many object having name property(get rid of object)
    const countryNameArr = data.map(({ name: { official } }) => official);
    return countryNameArr;
  }

  async #getOneCountryData(countryName) {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    const [data] = await res.json();

    return data;
  }

  async #randomlyChooseCountryName() {
    let data;
    try {
      const res = await fetch("https://restcountries.com/v2/all");
      data = await res.json();
    } catch (err) {
      console.log(err);
    }

    const countryNameArr = [];
    let i = 0;
    while (i < 3) {
      const randomNum = this.#createRandomNumber(0, data.length - 1);

      // note that countryName is an object
      const countryName = data[randomNum];

      // check random country is not duplicate, and not as same as user's country
      if (
        !countryNameArr.includes(countryName.name) &&
        this.userCountryInfo.countryName !== countryName.name &&
        countryName.name
      ) {
        countryNameArr.push(countryName.name);

        // nice!!!
        // set this.countryInfo in order
        this.Computer1CountryInfo.countryName
          ? this.Computer2CountryInfo.countryName
            ? (this.Computer3CountryInfo.countryName = countryName.name)
            : (this.Computer2CountryInfo.countryName = countryName.name)
          : (this.Computer1CountryInfo.countryName = countryName.name);

        i++;
      }
    }

    return countryNameArr;
  }

  async #randomlyChooseUserCountryName() {
    let data;
    try {
      const res = await fetch("https://restcountries.com/v2/all");
      data = await res.json();
    } catch (err) {
      console.log(err);
    }
    const randomNum = this.#createRandomNumber(0, data.length);

    return data[randomNum].name;
  }

  ///////////////////////////////////////
  // *** CREATE COUNTRY HTML ***
  ///////////////////////////////////////
  #createCountryHTMLAndShowUI(data, player, playerOverlay) {
    const countryName = data.name.common;

    let htmlCountryName;

    // resize the name of country
    if (countryName.length >= 30)
      htmlCountryName = `<p class = "country__name font1">${countryName}</p>`;
    else if (countryName.length >= 20 && countryName.length < 30)
      htmlCountryName = `<p class = "country__name font2">${countryName}</p>`;
    else if (countryName.length >= 10 && countryName.length < 20)
      htmlCountryName = `<p class = "country__name font3">${countryName}</p>`;
    else
      htmlCountryName = `<p class = "country__name font4">${countryName}</p>`;

    const htmlImg = `        
          <img class="country__img" src="${data.flags.svg}" />`;

    playerOverlay.insertAdjacentHTML("afterbegin", htmlCountryName);
    player.insertAdjacentHTML("beforeend", htmlImg);
  }

  ///////////////////////////////////////
  // *** MAIN CONTENT ***
  ///////////////////////////////////////
  #setAllCountentDataAndUI() {
    // set userName on UI
    DOM.userName.textContent = this.userName;

    // set level on UI
    DOM.btnShowLevel.textContent = this.level;
    DOM.popupLevelWord.textContent = this.level;

    // set max number on UI
    DOM.rangeNumberMax.textContent = this.maxNumber;

    // show country image and name on UI
    this.#showUserCountryImg();
    this.#showComputerCountryImg();

    // show remaining counts of tool
    DOM.remaingCounts.forEach(
      (count) => (count.textContent = this.userCountryInfo.toolCounts)
    );

    // set target number
    this.#createTargetNumber();

    // user turn
    this.#userTurn();
  }

  #showContent() {
    this.#setAllCountentDataAndUI();

    // show all content
    DOM.page.forEach((page) => page.classList.remove("hiddenDisplay"));
    this.#timeout(0).then(() => {
      DOM.page.forEach((page) => page.classList.remove("hiddenOpacity"));
    });
  }

  #hideForm() {
    DOM.formOverlay.classList.add("hiddenDisplay");
    this.formCollection.forEach((form) => form.classList.add("hiddenDisplay"));
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
  // *** GUESSING NUMBER LOGIC ***
  ///////////////////////////////////////
  // this is only invoked when user submit input
  #checkGuessInput(e, random = false) {
    // prevent user accidentally input empty string
    // only use css to pretend there is no button (check css input button)
    if (!random && DOM.guessInput.value === "") return;

    // e may be null (user randomly guess number)
    e && e.preventDefault();

    let guessNumber;

    // randomly guess number
    if (random) {
      guessNumber = this.#createComputerGuessingNumber(
        this.minNumber,
        this.maxNumber
      );
    }
    // manually guess number
    else {
      guessNumber = Number(DOM.guessInput.value);
      const checked = this.#checkInput(guessNumber);

      if (checked) {
        // wrong input UI (stop keeping executing)
        this.#showPopupInvalidInput();
        return;
      }

      this.#closeCountDown();
    }

    this.#takeGuessInput(guessNumber);

    this.myTurn = false;

    // close "Your turn" UI
    this.#closePlayerOrderUI();

    // close guess input
    // have to put here, or we cannot accept the user's input
    this.#closeGuessInput();
    DOM.guessInput.value = "";
  }

  #takeComputerGuessInput() {
    // create random guessing number for computer
    const guessNumber = this.#createComputerGuessingNumber(
      this.minNumber,
      this.maxNumber
    );

    this.#takeGuessInput(guessNumber, false);
  }

  #takeGuessInput(guessNumber, userPlayer = true) {
    /*
    Here, we have to first check if computer use tool
    Because it doesn't make sense use tool after showing guessing UI(see below)
    If computer decide using tool, diretly use tool, stop keeping executing
    If computer don't use tool, then keep executing(show guess UI....)
    */
    /* 
    Here, check three things in order
    (1) If it's computer's guessing round
    (2) If computer guess the bomb number
    (3) If computer can use tool(toolCounts may be 0)
    Again, order does matter here
    */
    if (
      !userPlayer &&
      this.targetNumber === guessNumber &&
      !this.#computerGuessNumberLogic()
    ) {
      this.#useToolComputer();
      return;
    }

    this.#timeout(0)
      .then(() => {
        // guessNumber UI(pink & blue)
        this.#showGuessNumberUI(guessNumber);

        return this.#timeout(5);
      })
      // guess the bomb number
      .then(() => {
        if (guessNumber === this.targetNumber) {
          if (userPlayer) {
            // user game over UI
            this.#showPopupUserLoseGame();
          } else {
            // user win the game
            if (this.allPlayerArr.length === 2) {
              this.#userWinGame();
            }
            // not yet win the game
            else this.#computerLoseGame();
          }

          this.#closeGuessNumberUI();
          return true;
        } else {
          // not guess the bomb number -> updating UI
          this.#showPassUI();
          this.#updateMinMaxRange(guessNumber);

          // wait another 3 second because showPassUI is exactly 3 second
          return this.#timeout(3);
        }
      })
      .then((arg) => {
        if (!arg) {
          this.#closeGuessNumberUI();
          this.#closePassUI();

          // update next order(go to next player)
          this.#checkOrderAndUpdate();
        }
      });
  }

  #computerGuessNumberLogic() {
    /*
    first check computer if is out of tool counts
    if yes, lose game
    then check computer wants use tool
    */
    if (
      this.#checkComputerUseToolCounts(this.allPlayerArr[this.currentOrder]) ||
      this.#checkIfComputerUseTool()
    ) {
      // lose game
      return true;
    }

    // use tool
    return false;
  }

  #checkIfComputerUseTool() {
    // if remaining one guess number, defenitely use tool
    if (this.maxNumber - this.minNumber === 2) return false;

    const randomNum = this.#createRandomNumber(1, 100);
    if (randomNum % 2 === 0) return true;
    else return false;
  }

  #checkComputerUseToolCounts(player) {
    if (player.toolCounts === 0) return true;
    player.toolCounts--;
    return false;
  }

  ///////////////////////////////////////
  // *** COMPUTER LOSE GAME ***
  ///////////////////////////////////////
  #computerLoseGame() {
    // blur lose image
    this.#blurCountryImg();

    // show popup UI
    this.#showPopupComputerLoseGame();

    // add user tool counts
    this.userCountryInfo.toolCounts++;

    // show remaining counts of tool
    DOM.remaingCounts.forEach(
      (count) => (count.textContent = this.userCountryInfo.toolCounts)
    );
  }

  #showPopupComputerLoseGame() {
    this.#showPopupOverlay();
    DOM.popupComputerLoseGame.classList.remove("hiddenDisplay");

    // show which conutry(player) lose the game
    document.querySelector(
      ".popup__computerLoseGame__countryName"
    ).textContent = this.allPlayerArr[this.currentOrder].countryName;

    // show bomb number
    DOM.bombNumberComputer.textContent = this.targetNumber;
  }

  #closePopupComputerLoseGame() {
    this.#closePopupOverlay();
    DOM.popupComputerLoseGame.classList.add("hiddenDisplay");

    // hide bomb number
    DOM.bombNumberComputer.textContent = "";

    // eliminate player
    this.#eliminatePlayerAndReset(this.currentOrder);
    this.#checkOrderAndUpdate();
  }

  #eliminatePlayerAndReset(playerNumber) {
    const playerElement = this.allPlayerArr[playerNumber];

    const newPlayerArr = this.#deleteElementFromArray(
      this.allPlayerArr,
      playerElement
    );

    // reset all player all
    this.allPlayerArr = newPlayerArr;

    // reset number range
    this.#resetNumberRange();

    // reset target number
    this.#createTargetNumber();

    this.#nextPlayerAfterElimination();
  }

  #resetNumberRange() {
    this.minNumber = 0;
    this.maxNumber = this.maxNumberNoChange;

    // set range number on UI
    DOM.rangeNumberMax.textContent = this.maxNumber;
    DOM.rangeNumberMin.textContent = this.minNumber;
  }

  #blurCountryImg() {
    const losingCountryOrder = this.allPlayerArr[this.currentOrder].order;

    const contentChildren = Array.from(
      document.querySelector(".content").children
    );

    const losingPlayer = contentChildren.find((child) =>
      child.classList.contains(`player--${losingCountryOrder}`)
    );

    losingPlayer.classList.add("country__img--lose");
  }

  /*
  Here, we make sure the next player is correct
  If now it's not reverse, we have to let order be the previose one
  Because later will increase one and this.allPlayerArr is change too
  If not it's reverse, then do nothing
  (try to graph and think)
  */
  #nextPlayerAfterElimination() {
    if (!this.reverse) {
      this.currentOrder = this.currentOrder - 1;
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
      input >= this.maxNumber ||
      input <= this.minNumber
    );
  }

  ///////////////////////////////////////
  // *** UPDATE ORDER UI ***
  ///////////////////////////////////////
  #updateOrderUI(order) {
    // it's user's turn
    if (order === 0) {
      this.#userTurn();
    }
    // it's computer's turn
    else {
      this.#closePlayerOrderUI();

      const currentCountryName = this.allPlayerArr[order].countryName;

      // wait for computer's guessing(pretend computer is thinking(guessing))
      this.#waitComputerGuessingNumber(
        this.#showComputerWaitingUI.bind(this, `${currentCountryName}`)
      );
    }
  }

  #userTurn() {
    this.#showGuessInput();
    this.#showPlayerOrderUI("Your turn");

    this.myTurn = true;

    this.#showCountdown();
  }

  ///////////////////////////////////////
  // *** CLOCKWISE || COUNTERCLOCKWISE ***
  ///////////////////////////////////////
  #updateClockwiseOrder() {
    this.currentOrder++;

    if (this.currentOrder >= this.allPlayerArr.length) this.currentOrder = 0;
  }

  #updateCounterClockwiseOrder() {
    this.currentOrder--;

    if (this.currentOrder <= -1)
      this.currentOrder = this.allPlayerArr.length - 1;
  }

  ///////////////////////////////////////
  // *** WAIT COMPUTER GUESSING NUMBER ***
  ///////////////////////////////////////
  #waitComputerGuessingNumber(cb1) {
    const randomTime = this.#createRandomNumber(1, 5);

    // this.#showComputerWaitingUI
    cb1();

    this.#timeout(randomTime).then(() => {
      // after waiting, do these two things
      this.#closeComputerWaitingUI();

      // next player
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
    DOM.guessNumber.textContent = "";
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

  #closePopupInvalidInput() {
    this.#closePopupOverlay();
    DOM.popupInvalidInput.classList.add("hiddenDisplay");

    DOM.popupInvalidInput.classList.add("hiddenOpacity");

    this.#showPlayerOrderUI("Your turn");
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
  #showComputerWaitingUI(playerCountry) {
    DOM.guessOrder.textContent = playerCountry;

    DOM.waiting.forEach((wait) => wait.classList.remove("hiddenDisplay"));
    DOM.bounce1.classList.add("spinner--animation1");
    DOM.bounce2.classList.add("spinner--animation2");
    DOM.bounce3.classList.add("spinner--animation3");
  }

  #closeComputerWaitingUI() {
    DOM.guessOrder.textContent = "";

    DOM.waiting.forEach((wait) => wait.classList.add("hiddenDisplay"));
    DOM.bounce1.classList.remove("spinner--animation1");
    DOM.bounce2.classList.remove("spinner--animation2");
    DOM.bounce3.classList.remove("spinner--animation3");
  }

  ///////////////////////////////////////
  // *** COMPUTER GUESSING NUMBER ***
  ///////////////////////////////////////
  #createComputerGuessingNumber(min, max) {
    return this.#createRandomNumber(min + 1, max - 1);
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
  #showCountryInfo(e) {
    this.#chooseCountryInfo(Number(e.target.dataset.id));

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

  #chooseCountryInfo(order) {
    const countryName = this.allPlayerArrNoChange[order].countryName;
    const contryElement = document.querySelector(".countryInfo__name");

    // resize font size
    if (countryName.length >= 30) contryElement.style.fontSize = "2rem";
    else if (countryName.length >= 20 && countryName.length < 30)
      contryElement.style.fontSize = "3rem";
    else if (countryName.length >= 10 && countryName.length < 20)
      contryElement.style.fontSize = "4rem";
    else contryElement.style.fontSize = "5rem";
    contryElement.textContent = this.allPlayerArrNoChange[order].countryName;

    console.log(this.allPlayerArrNoChange[order].countryData);
    /*
    altSpellings: (4) ['MG', 'Republic of Madagascar', "Repoblikan'i Madagasikara", 'République de Madagascar']
area: 587041
capital: ['Antananarivo']
capitalInfo: {latlng: Array(2)}
car: {signs: Array(1), side: 'right'}
cca2: "MG"
cca3: "MDG"
ccn3: "450"
cioc: "MAD"
coatOfArms: {png: 'https://mainfacts.com/media/images/coats_of_arms/mg.png', svg: 'https://mainfacts.com/media/images/coats_of_arms/mg.svg'}
continents: ['Africa']
currencies: {MGA: {…}}
demonyms: {eng: {…}, fra: {…}}
fifa: "MAD"
flag: "🇲🇬"
flags: {png: 'https://flagcdn.com/w320/mg.png', svg: 'https://flagcdn.com/mg.svg'}
gini: {2012: 42.6}
idd: {root: '+2', suffixes: Array(1)}
independent: true
landlocked: false
languages: {fra: 'French', mlg: 'Malagasy'}
latlng: (2) [-20, 47]
maps: {googleMaps: 'https://goo.gl/maps/AHQh2ABBaFW6Ngj26', openStreetMaps: 'https://www.openstreetmap.org/relation/447325'}
name: {common: 'Madagascar', official: 'Republic of Madagascar', nativeName: {…}}
population: 27691019
postalCode: {format: '###', regex: '^(\\d{3})$'}
region: "Africa"
startOfWeek: "monday"
status: "officially-assigned"
subregion: "Eastern Africa"
timezones: ['UTC+03:00']
tld: ['.mg']
translations: {ara: {…}, ces: {…}, cym: {…}, deu: {…}, est: {…}, …}
unMember: true
    */

    // manually set country info
    document.querySelector(".countryInfo__content").textContent =
      this.allPlayerArrNoChange[order].countryData.region || "NO PROVIDED";
    document.querySelector(".countryInfo__capital").textContent =
      this.allPlayerArrNoChange[order].countryData.capital[0] || "NO PROVIDED";
    document.querySelector(".countryInfo__area").textContent =
      this.#convertNumberToString(
        this.allPlayerArrNoChange[order].countryData.area
      ) || "NO PROVIDED";
    document.querySelector(".countryInfo__population").textContent =
      this.#convertNumberToString(
        this.allPlayerArrNoChange[order].countryData.population
      ) || "NO PROVIDED";
    // document.querySelector(".countryInfo__currencies").textContent =
    //   this.allPlayerArrNoChange[order].countryData.currencies[0].code ||
    //   "NO PROVIDED";

    document.querySelector(".countryInfo__language").textContent =
      Object.values(
        this.allPlayerArrNoChange[order].countryData.languages
      )[0] || "NO PROVIDED";
  }

  #convertNumberToString(num) {
    if (num === undefined) return null;

    let newNum;
    if (num > 1000000) {
      newNum = String((num / 1000000).toFixed(1)) + "M";
      return newNum;
    } else if (num > 1000) {
      newNum = String((num / 1000).toFixed(1)) + "K";
      return newNum;
    }

    return String(num);
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

    // question
    if (targetElement.closest(".popup__question")) {
      targetElement
        .closest(".popup__question")
        .classList.toggle("hiddenDisplay");
    }

    // rule
    if (targetElement.closest(".popup__rule")) {
      // check if game is starting (user may check the rule before game)
      if (!this.targetNumber) {
        this.#closeCheckRule();
      } else
        targetElement.closest(".popup__rule").classList.toggle("hiddenDisplay");
    }

    // diff level
    if (targetElement.closest(".popup__diffLevel")) {
      targetElement
        .closest(".popup__diffLevel")
        .classList.toggle("hiddenDisplay");
    }

    // tool
    if (targetElement.closest(".popup__tool")) {
      targetElement.closest(".popup__tool").classList.toggle("hiddenDisplay");
    }
  }

  ///////////////////////////////////////
  // *** POPUP LEVEL ***
  ///////////////////////////////////////
  #showPopupLevel(e) {
    // this callback attach on whole div containing three level button
    // first check if user click the right place
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

  #changeLevel() {
    location.reload();
  }

  #showPopupLevelSmall() {
    this.#showPopupOverlay();

    DOM.popupLevel.classList.remove("hiddenDisplay");

    this.#timeout(0).then(() => {
      DOM.popupLevel.classList.remove("hiddenOpacity");
    });

    this.#menuCheckboxToggle();
    DOM.navCheckbox.checked = false;
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

  #showPopupQuestionSmall() {
    this.#showPopupOverlay();
    DOM.popupQuestion.classList.remove("hiddenDisplay");

    this.#timeout(0).then(() =>
      DOM.popupQuestion.classList.remove("hiddenOpacity")
    );

    // close menu background, and set the state back to unchecked
    this.#menuCheckboxToggle();
    DOM.navCheckbox.checked = false;
  }

  ///////////////////////////////////////
  // *** POPUP DIFFERENT QUESTION (RULE, LEVEL, TOOL) ***
  ///////////////////////////////////////
  // use one callback function attach on one enitre question pop up
  // use .contains to check what button is user currently clicking
  #showPopupDiffQuestion(e) {
    const targetElement = e.target;

    if (targetElement.classList.contains("btn__popup__question")) {
      DOM.popupQuestion.classList.add("hiddenDisplay");

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
  #showPopupAssignUI() {
    // get current number of player (exclude user player)
    const currentPlayerNumber = this.allPlayerArr.length - 1;
    let result;

    if (this.reverse) result = [2, 3, 4];
    else result = [0, 1, 2];

    // removing element from result array while this.allPlayerArr decrease too
    while (currentPlayerNumber !== result.length) {
      result.pop();
    }

    let html = `
    <h5 class = "popup__subTitle--assign">
      Which player <br />
      do you want to assign?
    </h5>
    <select class="popup__assign__select" id="assign">
    `;

    for (let i = 0; i < result.length; i++) {
      html += `<option value="${result[i]}">${
        this.allPlayerArr[i + 1].countryName
      }(${this.allPlayerArr[i + 1].position})</option>
      `;
    }

    html += `</select>`;

    return html;
  }

  ///////////////////////////////////////
  // *** POPUP USE TOOL ***
  ///////////////////////////////////////
  #showPopupUseTool(e) {
    // first check if it's user's turn
    if (!this.myTurn) {
      this.#showPopupCantUseTool();
      return;
    }

    // then check counts if can use tool
    if (this.userCountryInfo.toolCounts === 0) {
      this.#showPopupCantUseTool(true);
      return;
    }

    // okay, user can use tool
    this.#showPopupOverlay();
    DOM.popupUseTool.classList.remove("hiddenDisplay");

    this.#popupUseToolUI(e.target.closest(".btn__tool--use").dataset.id);
  }

  #closePopupUseTool() {
    DOM.popupUseTool.classList.add("hiddenOpacity");
    DOM.popupUseToolDescription.style.fontSize = "2.5rem";

    this.#timeout(0).then(() => {
      this.#closePopupOverlay();
      DOM.popupUseTool.classList.add("hiddenDisplay");
    });

    // remove the svg icon in every time closing
    // can't use DOM.popupUseToolIcon
    // because there is no html element at the time we invoking the DOM__SELECTION
    // so DOM.popupUseToolIcon === null
    document.querySelector(".popup__useTool__icon").remove();

    // also remove assign UI
    // have to first check if element exist
    document.querySelector(".popup__subTitle--assign") !== null &&
      document.querySelector(".popup__subTitle--assign").remove();
    document.querySelector(".popup__assign__select") !== null &&
      document.querySelector(".popup__assign__select").remove();
  }

  #popupUseToolUI(tool) {
    // assign
    if (tool === "ASSIGN") {
      DOM.popupUseToolTitle.insertAdjacentHTML(
        "afterend",
        this.#showPopupAssignUI()
      );
      DOM.popupUseToolTitle.insertAdjacentHTML("afterend", SVG.assign);

      // font size of description smaller
      // because UI of assign is more
      DOM.popupUseToolDescription.style.fontSize = "2rem";
    }

    // pass
    if (tool === "PASS")
      DOM.popupUseToolTitle.insertAdjacentHTML("afterend", SVG.pass);

    // uturn
    if (tool === "U-TURN")
      DOM.popupUseToolTitle.insertAdjacentHTML("afterend", SVG.uturn);

    this.#timeout(0).then(() =>
      DOM.popupUseTool.classList.remove("hiddenOpacity")
    );
  }

  ///////////////////////////////////////
  // *** SHOW USE TOOL UI ***
  ///////////////////////////////////////
  #showUseToolUI(tool, player) {
    // re-position based on the length of county name
    if (player.length >= 20) {
      DOM.guessUseTool.style.top = "78%";
      DOM.guessUseToolUserName.style.top = "43%";
    } else DOM.guessUseTool.style.top = "55%";

    // set tool html
    const useToolHTML = `use ${tool}`;

    // show html on UI
    DOM.guessUseToolUserName.textContent = `${player}`;
    DOM.guessUseTool.textContent = useToolHTML;

    // close popup (only need to close if it's user using the tool)
    if (player === this.userCountryInfo.countryName) this.#closePopupUseTool();

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
    this.userCountryInfo.toolCounts--;

    // reset all counts UI
    DOM.remaingCounts.forEach(
      (count) => (count.textContent = this.userCountryInfo.toolCounts)
    );

    // close "Your turn" UI
    this.#closePlayerOrderUI();

    // close guess input UI
    this.#closeGuessInput();
    DOM.guessInput.value = "";

    // close tool UI
    this.#toolBtnToggle();

    // not my turn anymore
    this.myTurn = false;

    // close countdown
    this.#closeCountDown();

    // get the used tool
    const tool = e.target
      .closest(".popup__useTool")
      .querySelector(".popup__useTool__icon").dataset.id;

    this.#useToolLogic(tool, this.userCountryInfo.countryName);
  }

  #useToolComputer() {
    // check current player(country)
    const currentCountryName = this.allPlayerArr[this.currentOrder].countryName;
    const tool = this.#whichToolComputer();

    this.#useToolLogic(tool, currentCountryName);
  }

  #useToolLogic(tool, playerName) {
    this.#timeout(0)
      .then(() => {
        this.#whichTool(tool);
      })
      .then(() => {
        this.#showUseToolUI(tool, playerName);

        return this.#timeout(3);
      })
      .then(() => {
        // later, close whole UI
        this.#closeUseToolUI();

        // next round
        this.#checkOrderAndUpdate();
      });
  }

  ///////////////////////////////////////
  // *** WHICH TOOL ***
  ///////////////////////////////////////
  #whichTool(tool) {
    // pass
    if (tool === "PASS") {
      return;
    }

    // uturn
    if (tool === "U-TURN") {
      this.reverse = !this.reverse;
      return;
    }

    // assign
    const assignOrder = document.querySelector(".popup__assign__select");

    // user use assign
    if (assignOrder) this.currentOrder = assignOrder.value;
    // computer use assign
    else {
      // avoid assign itself
      let randomNumAssign;
      while (true) {
        randomNumAssign = this.#createRandomNumber(0, this.allPlayerArr.length);

        // edge case
        if (
          this.currentOrder === this.allPlayerArr.length - 1 &&
          this.reverse &&
          randomNumAssign === 0
        )
          continue;

        /*
        avoid assign itself
        Logic
        if now it's reverse, we don't wanna select a random number === current order + 1
        because later will immediately add one on current order, then it will back to itself
        same for non-reverse
        */
        if (this.reverse) {
          if (randomNumAssign !== this.currentOrder + 1) break;
        } else if (randomNumAssign !== this.currentOrder - 1) break;
      }

      this.currentOrder = randomNumAssign;
    }
  }

  #whichToolComputer() {
    const randomNumberTool = this.#createRandomNumber(0, 2);

    // pass
    if (randomNumberTool == 1) {
      return "PASS";
    }
    // reverse
    else if (randomNumberTool == 2) {
      return "U-TURN";
    }
    // assign
    else {
      return "ASSIGN";
    }
  }

  ///////////////////////////////////////
  // *** TOOL EXTENSION BTN ***
  ///////////////////////////////////////
  #showDiffToolUI() {
    this.#showPopupOverlay();
    DOM.popupTool.classList.remove("hiddenDisplay");
  }

  ///////////////////////////////////////
  // *** POP UP CAN'T USE TOOL ***
  ///////////////////////////////////////
  #showPopupCantUseTool(counts = false) {
    this.#showPopupOverlay();

    // set content of different error
    if (counts) {
      DOM.popupCantUseToolDescription.textContent =
        "You ran out of the tool counts";
    } else {
      DOM.popupCantUseToolDescription.textContent =
        "can't use tool during other player's round";
    }

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
  // *** POP UP USER LOSE GAME ***
  ///////////////////////////////////////
  #showPopupUserLoseGame() {
    this.#showPopupOverlay();
    DOM.popupUserLoseGame.classList.remove("hiddenDisplay");
    DOM.bombNumberUser.textContent = this.targetNumber;

    // only user lose the game, add eventlistenr on reload btn
    document
      .querySelector(".btn__popup__restart--lose")
      .addEventListener("click", function () {
        location.reload();
      });
  }

  ///////////////////////////////////////
  // *** IF SCREEN GETTING SMALLER (USE TOOL) ***
  ///////////////////////////////////////
  #useToolSmall(e) {
    if (window.innerWidth <= 1200) {
      // first check if it's user's turn
      if (!this.myTurn) {
        this.#showPopupCantUseTool();
        return;
      }

      // then check counts if can use tool
      if (this.userCountryInfo.toolCounts === 0) {
        this.#showPopupCantUseTool(true);
        return;
      }

      // okay, user can use tool
      this.#showPopupOverlay();
      DOM.popupUseTool.classList.remove("hiddenDisplay");

      this.#popupUseToolUI(e.target.textContent);
    }
  }

  ///////////////////////////////////////
  // *** USER WIN THE GAME ***
  ///////////////////////////////////////
  #userWinGame() {
    this.#showPopupOverlay();
    DOM.popupUserWinGame.classList.remove("hiddenDisplay");
    document.querySelector(".popup__userWinGame__currentLevel").textContent =
      this.level;

    document
      .querySelector(".btn__popup__restart--win")
      .addEventListener("click", function () {
        location.reload();
      });
  }

  ///////////////////////////////////////
  // *** FORM RANGE CHECK RULE ***
  ///////////////////////////////////////
  #showCheckRule() {
    this.#showPopupOverlay();
    DOM.popupRule.classList.remove("hiddenDisplay");

    DOM.formRange.classList.add("hiddenDisplay");
    DOM.formOverlay.classList.add("hiddenDisplay");
  }

  #closeCheckRule() {
    this.#closePopupOverlay();
    DOM.popupRule.classList.add("hiddenDisplay");

    DOM.formRange.classList.remove("hiddenDisplay");
    DOM.formOverlay.classList.remove("hiddenDisplay");
  }
}

const app = new APP();
