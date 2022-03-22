import { DOM } from "./domSelection.js";
import { SVG } from "./svgIcon.js";
import { PLAYER__INFO } from "./playerInfo.js";

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

    // userName
    this.userName;

    // LEVEL
    this.level = "easy";

    // NUMBER
    this.targetNumber;
    this.minNumber = 0;
    this.maxNumber;
    this.maxNumberNoChange;

    // CLICK TOGGLE
    this.btnToolToggle = true;
    this.btnMenuToggle = true;

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

    // Guessing Animation Duration
    this.guessAnimationTime = 5;

    // EVENT LISTENER
    this.addEventListener();

    // cache (region) (select)
    this.cacheAllCountryData = null;
    this.cacheRegion = {};

    this.btnToolQuestion = false;
  }

  ///////////////////////////////////////
  // *** Input Change ***
  ///////////////////////////////////////
  inputChangeHandler(e) {
    const value = Number(e.target.value);

    // invalid
    if (this.checkInput(value)) {
      DOM.guessInput.classList.add("guess__input--invalid");
      DOM.btnGuessInput.classList.add("hidden--display");
      DOM.guessOrder.textContent = "Invalid Number";
      DOM.guessOrder.classList.add("guess__number--invalid");
    }
    // valid
    else {
      DOM.guessInput.classList.remove("guess__input--invalid");
      DOM.btnGuessInput.classList.remove("hidden--display");
      DOM.guessOrder.textContent = "Your Turn";
      DOM.guessOrder.classList.remove("guess__number--invalid");
    }
  }

  enterPressHandler(e) {
    if (e.code === "Enter" && !this.checkInput(Number(DOM.guessInput.value))) {
      this.btnCheckClickHandler();
    }
  }

  checkInput(input) {
    return (
      typeof input !== "number" ||
      Number.isNaN(input) ||
      input >= this.maxNumber ||
      input <= this.minNumber
    );
  }

  ///////////////////////////////////////
  // *** Form Order ***
  ///////////////////////////////////////
  nextFormPage() {
    this.formCollection[this.formOrder].classList.add("hidden--display");

    this.formCollection[++this.formOrder].classList.remove("hidden--display");
  }

  backFormPage() {
    this.formCollection[this.formOrder].classList.add("hidden--display");

    this.formCollection[--this.formOrder].classList.remove("hidden--display");
  }

  ///////////////////////////////////////
  // *** Form ***
  ///////////////////////////////////////
  btnFormUserNameNextClickHandler() {
    this.userName = DOM.formInput.value;

    this.nextFormPage();
  }

  ///////////////////////////////////////
  // *** Form Level ***
  ///////////////////////////////////////
  formInputLevelClickHandler(e) {
    // note that e.target will select two element at the same time(input & level)
    // (1) find the elemet has data-id attribute
    const inputLevelDom = e.target.closest(".form__level__input");

    // (2) filter any possible outcome is null
    if (inputLevelDom) {
      DOM.formLevelDescriptionCounts.textContent = inputLevelDom.dataset.id;
      this.level = inputLevelDom.value;
    }
  }

  btnFormLevelNextClickHandler() {
    // set tool counts based on level
    switch (this.level) {
      case "easy":
        this.userCountryInfo.toolCounts = 3;
        break;

      case "medium":
        this.userCountryInfo.toolCounts = 2;
        break;

      case "hard":
        this.userCountryInfo.toolCounts = 1;
        break;

      default:
        break;
    }

    this.nextFormPage();
  }

  ///////////////////////////////////////
  // *** Form Country ***
  ///////////////////////////////////////
  async formCountryRegionSelectChangeHandler() {
    const region = DOM.formCountryRegionSelect.value;

    this.disabledCountryBtn();
    await this.showSelectCountryAndImg(region);
    this.activeCountryBtn();
  }

  async formCountryNameSelectChangeHandler() {
    const countryName = DOM.formCountryNameSelect.value;

    this.disabledCountryBtn();
    await this.showFormCountryImg(countryName);
    this.activeCountryBtn();
  }

  async btnFormCountryNextClickHandler() {
    this.userCountryInfo.countryName = DOM.formCountryNameSelect.value;

    this.nextFormPage();

    // show form range UI
    this.formRangeInputChangeHandler();
  }

  showFormCountryNameSelect(countryNameArr) {
    let html = ``;
    countryNameArr.forEach((country) => {
      html += `<option value="${country}">${country}</option>`;
    });

    DOM.formCountryNameSelect.insertAdjacentHTML("beforeend", html);
  }

  async showFormCountryImg(country) {
    this.showImgLoading();

    const countryFlag = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );

    const [
      {
        flags: { svg: data },
      },
    ] = await countryFlag.json();

    // change the image
    DOM.formCountryImg.src = data;
    this.removeImgLoading();
  }

  async btnRandomClickHandler() {
    this.disabledCountryBtn();

    if (!this.cacheAllCountryData) {
      try {
        this.showRandomlySelectLoading();
        const res = await fetch("https://restcountries.com/v3.1/all");
        this.cacheAllCountryData = await res.json();

        this.removeRandomlySelectLoading();
      } catch (err) {
        console.error(err);
      }
    }

    const randomNum = this.createRandomNumber(
      0,
      this.cacheAllCountryData.length - 1
    );
    const randomCountry = this.cacheAllCountryData[randomNum];
    const region = randomCountry.region;

    // show the region
    DOM.formCountryRegionSelect.value = randomCountry.region;

    // handle the process after seleting the region
    await this.showSelectCountryAndImg(region, randomCountry.name.official);

    this.activeCountryBtn();
  }

  async showSelectCountryAndImg(region, randomCountry = null) {
    this.removePreCountrySelect();

    if (this.cacheRegion[region]) {
      this.showFormCountryNameSelect(this.cacheRegion[region]);
      await this.hasRandomCountryAndShowImg(
        randomCountry,
        this.cacheRegion[region][0]
      );
      return;
    }

    this.showCountrySelectLoading();
    const countryData = await this.getCountryDataFromRegion(region);
    this.cacheRegion[region] = countryData;
    this.removeCountrySelectLoading();

    // show the next button
    DOM.btnFormCountryNext.classList.remove("hidden--display");

    this.showFormCountryNameSelect(countryData);

    await this.hasRandomCountryAndShowImg(randomCountry, countryData[0]);
  }

  removePreCountrySelect() {
    // convert children to array
    const countryNameChildren = Array.from(DOM.formCountryNameSelect.children);

    // if selected before, delete original one
    countryNameChildren.forEach((child) =>
      DOM.formCountryNameSelect.remove(child)
    );
  }

  async hasRandomCountryAndShowImg(randomCountry, countryData) {
    if (randomCountry) {
      // show the name
      DOM.formCountryNameSelect.value = randomCountry;

      await this.showFormCountryImg(randomCountry);
    } else {
      await this.showFormCountryImg(countryData);
    }
  }

  async getCountryDataFromRegion(region) {
    const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);

    const data = await res.json();

    /*
    data is an array containing many object
    But we only want name property
    */
    const countryNameArr = data.map(({ name: { official } }) => official);
    return countryNameArr;
  }

  showCountrySelectLoading() {
    DOM.formCountryImg.classList.add("hidden--opacity");
    DOM.formCountryNameSelect.insertAdjacentHTML(
      "beforeend",
      `<option selected disabled class="form__country__option form__country__option--loading text-cap" value = "loading">
          loading...
          </option>`
    );
    DOM.formCountryNameSelect.classList.add("form__country__select--disabled");
    DOM.formCountryNameSelect.disabled = true;
  }

  removeCountrySelectLoading() {
    DOM.formCountryNameSelect.remove(
      document.querySelector(".form__country__option--loading")
    );
    DOM.formCountryImg.classList.remove("hidden--opacity");
    DOM.formCountryNameSelect.classList.remove(
      "form__country__select--disabled"
    );
    DOM.formCountryNameSelect.disabled = false;
  }

  showRandomlySelectLoading() {
    // add loading text
    DOM.formCountryRegionSelect.insertAdjacentHTML(
      "beforeend",
      `<option disabled selected class="form__country__option form__country__option--loading form__country__option--loading--region text-cap" value = "loading">
          loading...
       </option>`
    );

    // add disabled style
    DOM.formCountryRegionSelect.classList.add(
      "form__country__select--disabled"
    );

    // set disabled true
    DOM.formCountryRegionSelect.disabled = true;

    this.showCountrySelectLoading();
  }

  removeRandomlySelectLoading() {
    // remove loading text
    DOM.formCountryRegionSelect.removeChild(
      document.querySelector(".form__country__option--loading--region")
    );

    // remove disabled style
    DOM.formCountryRegionSelect.classList.remove(
      "form__country__select--disabled"
    );

    // set disabled false
    DOM.formCountryRegionSelect.disabled = false;

    this.removeCountrySelectLoading();
  }

  disabledCountryBtn() {
    DOM.btnFormCountryNext.disabled = true;
    DOM.btnFormCountryBack.disabled = true;
    DOM.formBtnCountryRandom.disabled = true;

    DOM.btnFormCountryNext.classList.add("form__btn--country--disabled");
    DOM.btnFormCountryBack.classList.add("form__btn--country--disabled");
    DOM.formBtnCountryRandom.classList.add("form__btn--country--disabled");

    DOM.btnFormCountryNext.classList.remove("btn--blue");
    DOM.btnFormCountryBack.classList.remove("btn--pink");
    DOM.formBtnCountryRandom.classList.remove("btn--purple");
  }

  activeCountryBtn() {
    DOM.btnFormCountryNext.disabled = false;
    DOM.btnFormCountryBack.disabled = false;
    DOM.formBtnCountryRandom.disabled = false;

    DOM.btnFormCountryNext.classList.remove("form__btn--country--disabled");
    DOM.btnFormCountryBack.classList.remove("form__btn--country--disabled");
    DOM.formBtnCountryRandom.classList.remove("form__btn--country--disabled");

    DOM.btnFormCountryNext.classList.add("btn--blue");
    DOM.btnFormCountryBack.classList.add("btn--pink");
    DOM.formBtnCountryRandom.classList.add("btn--purple");
  }

  showImgLoading() {
    // hidden the image
    DOM.formCountryImg.classList.add("hidden--display");

    // show the loading
    DOM.formCountryRegion.insertAdjacentHTML(
      "beforeend",
      `<div class="form__country__loading" ></div>`
    );
  }

  removeImgLoading() {
    // remove the hidden
    DOM.formCountryImg.classList.remove("hidden--display");

    // remove the loading
    document.querySelector(".form__country__loading").remove();
  }

  ///////////////////////////////////////
  // *** Form Range ***
  ///////////////////////////////////////
  btnFormRangeNextClickHandler() {
    this.maxNumber = Number(DOM.formRangeInput.value);
    this.maxNumberNoChange = this.maxNumber;
    DOM.guessInput.setAttribute("max", String(this.maxNumberNoChange - 1));

    // start the game
    this.hideForm();
    this.showContent();
  }

  formRangeInputChangeHandler() {
    DOM.formRangeOutput.textContent = DOM.formRangeInput.value;
  }

  hideForm() {
    DOM.formOverlay.classList.add("hidden--display");
    this.formCollection.forEach((form) =>
      form.classList.add("hidden--display")
    );
  }

  ///////////////////////////////////////
  // *** Main Content ***
  ///////////////////////////////////////
  showContent() {
    this.setAllCountentDataAndUI();

    // show all content
    DOM.page.forEach((page) => page.classList.remove("hidden--display"));
    this.timeout(0).then(() => {
      DOM.page.forEach((page) => page.classList.remove("hidden--opacity"));
    });
  }

  async setAllCountentDataAndUI() {
    // set userName on UI
    DOM.userName.textContent = this.userName;

    // set level on UI
    DOM.btnShowLevel.textContent = this.level;
    DOM.popupLevelWord.textContent = this.level;

    // set max number on UI
    DOM.rangeNumberMax.textContent = this.maxNumber;

    // show country image and name on UI
    await this.showUserCountryImg();
    await this.showComputerCountryImg();

    // show remaining counts of tool
    DOM.remaingCounts.forEach(
      (count) => (count.textContent = this.userCountryInfo.toolCounts)
    );

    // set target number
    this.createTargetNumber();

    // user turn
    this.userTurn(true);

    // show guess input
    this.showGuessInput();

    // show info button
    DOM.btnInfo.forEach((btn) => btn.classList.remove("hidden--display"));
  }

  async showUserCountryImg() {
    this.showMainContentLoading(DOM.playerMain, "main");

    const countryName = this.userCountryInfo.countryName;
    const countryData = await this.getOneCountryData(countryName);

    // set user country info
    this.userCountryInfo.order = 0;
    this.userCountryInfo.countryData = countryData;

    this.createCountryHTMLAndShowUI(
      countryData,
      DOM.playerMain,
      DOM.playerOverlayMain
    );

    this.removeMainContentLoading(DOM.playerMain, "main");
  }

  async showComputerCountryImg() {
    this.showMainContentLoading(null, null, true);

    const randomCountryNameArr = await this.randomlyChooseCountryName();

    for (let i = 0; i < randomCountryNameArr.length; i++) {
      const countryData = randomCountryNameArr[i];

      // set computer country data, and show img UI
      switch (i) {
        case 0:
          {
            this.setCountryInfo(
              this.Computer1CountryInfo,
              1,
              3,
              countryData,
              "left"
            );

            this.createCountryHTMLAndShowUI(
              countryData,
              DOM.player1,
              DOM.playerOverlay1
            );

            this.removeMainContentLoading(DOM.player1, i);
          }
          break;

        case 1:
          {
            this.setCountryInfo(
              this.Computer2CountryInfo,
              2,
              3,
              countryData,
              "top"
            );

            this.createCountryHTMLAndShowUI(
              countryData,
              DOM.player2,
              DOM.playerOverlay2
            );

            this.removeMainContentLoading(DOM.player2, i);
          }
          break;

        case 2:
          {
            this.setCountryInfo(
              this.Computer3CountryInfo,
              3,
              3,
              countryData,
              "right"
            );

            this.createCountryHTMLAndShowUI(
              countryData,
              DOM.player3,
              DOM.playerOverlay3
            );

            this.removeMainContentLoading(DOM.player3, i);
          }
          break;

        default:
          break;
      }
    }
  }

  createCountryHTMLAndShowUI(data, player, playerOverlay) {
    const countryName = data.name.common;

    let htmlCountryName;

    // resize the name of country
    if (countryName.length >= 40)
      htmlCountryName = `<p class = "country__name font1">${countryName}</p>`;
    else if (countryName.length >= 30 && countryName.length < 40)
      htmlCountryName = `<p class = "country__name font1.5">${countryName}</p>`;
    else if (countryName.length >= 20 && countryName.length < 30)
      htmlCountryName = `<p class = "country__name font2">${countryName}</p>`;
    else if (countryName.length >= 10 && countryName.length < 20)
      htmlCountryName = `<p class = "country__name font3">${countryName}</p>`;
    else
      htmlCountryName = `<p class = "country__name font4">${countryName}</p>`;

    const htmlImg = `        
          <img class="country__img" src="${data.flags.svg}" alt="${countryName} flag" />`;

    playerOverlay.insertAdjacentHTML("afterbegin", htmlCountryName);
    player.insertAdjacentHTML("beforeend", htmlImg);
  }

  async getOneCountryData(countryName) {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    const [data] = await res.json();

    return data;
  }

  async randomlyChooseCountryName() {
    if (!this.cacheAllCountryData) {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        this.cacheAllCountryData = await res.json();
      } catch (err) {
        console.error(err);
      }
    }

    const countryNameArr = [];
    let i = 0;
    while (i < 3) {
      const randomNum = this.createRandomNumber(
        0,
        this.cacheAllCountryData.length - 1
      );

      // note that countryName is an object
      const {
        name: { common: countryName },
      } = this.cacheAllCountryData[randomNum];

      // check random country is not duplicate, and not as same as user's country
      if (
        !countryNameArr.includes(countryName) &&
        this.userCountryInfo.countryName !== countryName &&
        countryName
      ) {
        // store entire country object
        countryNameArr.push(this.cacheAllCountryData[randomNum]);

        // nice!!!
        // set this.countryInfo in order
        this.Computer1CountryInfo.countryName
          ? this.Computer2CountryInfo.countryName
            ? (this.Computer3CountryInfo.countryName = countryName)
            : (this.Computer2CountryInfo.countryName = countryName)
          : (this.Computer1CountryInfo.countryName = countryName);

        i++;
      }
    }

    return countryNameArr;
  }

  showMainContentLoading(player, argIndex, computer = false) {
    // set loading on computer player
    if (computer) {
      DOM.playerComputer.forEach((computer, index) =>
        computer.insertAdjacentHTML(
          "beforeend",
          `<div class="content__loading content__loading--${index}"></div>`
        )
      );
    }
    // set loading on main player
    else {
      player.insertAdjacentHTML(
        "beforeend",
        `<div class="content__loading content__loading--${argIndex}"></div>`
      );
    }
  }

  removeMainContentLoading(player, index) {
    player.removeChild(document.querySelector(`.content__loading--${index}`));
  }

  ///////////////////////////////////////
  // *** Countdown ***
  ///////////////////////////////////////
  showCountdown() {
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
        // close use tool popup and tool extension
        DOM.popupUseTool.classList.add("hidden--display");
        this.closePopupOverlay();

        this.btnCheckClickHandler(null, true);
        clearInterval(this.countDown);
        DOM.countdownTime.textContent = ``;
      }
    }, 1000);
  }

  closeCountDown() {
    clearInterval(this.countDown);
    DOM.countdownTime.textContent = ``;
  }

  ///////////////////////////////////////
  // *** Set Country Info ***
  ///////////////////////////////////////
  setCountryInfo(player, order, toolCounts, data, position) {
    player.order = order;
    player.toolCounts = toolCounts;
    player.countryData = data;
    player.position = position;
  }

  ///////////////////////////////////////
  // *** Check Order And Update ***
  ///////////////////////////////////////
  // use this.reverse to check current order
  checkOrderAndUpdate() {
    if (this.reverse) {
      this.updateCounterClockwiseOrder();
    } else {
      this.updateClockwiseOrder();
    }
    this.updateOrderUI(this.currentOrder);
  }

  updateClockwiseOrder() {
    this.currentOrder++;

    if (this.currentOrder >= this.allPlayerArr.length) this.currentOrder = 0;
  }

  updateCounterClockwiseOrder() {
    this.currentOrder--;

    if (this.currentOrder <= -1)
      this.currentOrder = this.allPlayerArr.length - 1;
  }

  ///////////////////////////////////////
  // *** Update Order UI ***
  ///////////////////////////////////////
  updateOrderUI(order) {
    // first empty the order UI
    this.closePlayerOrderUI();

    // it's user's turn
    if (order === 0) {
      this.userTurn();
    }
    // it's computer's turn
    else {
      const currentCountryName = this.allPlayerArr[order].countryName;

      // wait for computer's guessing(pretend computer is thinking(guessing))
      this.waitComputerGuessingNumber(currentCountryName);
    }
  }

  userTurn(firstTime = false) {
    if (!firstTime) DOM.btnGuessInput.classList.remove("hidden--display");

    this.showGuessInput();
    this.showPlayerOrderUI("Your turn");

    this.myTurn = true;

    this.showCountdown();
  }

  waitComputerGuessingNumber(currentCountryName) {
    const randomTime = this.createRandomNumber(1, 5);

    this.showComputerWaitingUI(currentCountryName);

    this.timeout(randomTime).then(() => {
      // after waiting, do these two things
      this.closeComputerWaitingUI();

      // next player
      this.takeComputerGuessInput();
    });
  }

  ///////////////////////////////////////
  // *** Guessing Number Logic ***
  ///////////////////////////////////////
  btnCheckClickHandler(e, random = false) {
    // prevent user accidentally input empty string
    if (!random && DOM.guessInput.value === "") return;

    // e may be null (user randomly guess number)
    e && e.preventDefault();

    let guessNumber;

    // randomly guess number(countdown to 0)
    if (random) {
      guessNumber = this.createComputerGuessingNumber(
        this.minNumber,
        this.maxNumber
      );
    }
    // manually guess number
    else {
      guessNumber = Number(DOM.guessInput.value);

      this.closeCountDown();
    }

    this.takeGuessInput(guessNumber);

    this.myTurn = false;

    // close "Your turn" UI
    this.closePlayerOrderUI();

    // close guess input
    // have to put here, or we cannot accept the user's input
    this.closeGuessInput();

    // hide submit btn
    DOM.btnGuessInput.classList.add("hidden--display");

    // remove invalid style
    DOM.guessOrder.classList.remove("guess__number--invalid");
  }

  takeComputerGuessInput() {
    // create random guessing number for computer
    const guessNumber = this.createComputerGuessingNumber(
      this.minNumber,
      this.maxNumber
    );

    this.takeGuessInput(guessNumber, false);
  }

  takeGuessInput(guessNumber, userPlayer = true) {
    /*
    Here, we have to first check if computer use tool
    Because it doesn't make sense use tool after showing guessing UI(see below)
    If computer decide using tool, diretly use tool, stop keeping executing
    If computer doesn't use tool, then keep executing(show guess UI....)
 
    Here, check three things in order
    (1) If it's in computer's guessing round
    (2) If computer guess the bomb number
    (3) If computer can use tool(toolCounts may be 0)
    Again, order DOES matter here
    */
    if (
      !userPlayer &&
      this.targetNumber === guessNumber &&
      this.computerGuessNumberLogic()
    ) {
      this.useToolComputer();
      return;
    }

    this.timeout(0)
      // guessing UI
      .then(() => {
        // setting guessing animation time
        this.guessAnimationTime = this.createRandomNumber(2, 5);

        // guessNumber UI(pink & blue)
        this.showGuessNumberUI(guessNumber);

        // wait for the guessing animation time
        return this.timeout(this.guessAnimationTime);
      })
      // check guessing number
      .then(() => {
        // guess the bomb number
        if (guessNumber === this.targetNumber) {
          if (userPlayer) {
            // user lose game UI
            this.showPopupUserLoseGame();
          } else {
            // user win the game
            if (this.allPlayerArr.length === 2) {
              this.showPopupUserWinGame();
            }
            // not yet win the game
            else this.computerLoseGame();
          }

          this.closeGuessNumberUI();
          return true;
        } else {
          // not guess the bomb number -> updating UI
          this.showPassUI();
          this.updateMinMaxRange(guessNumber);

          // wait another 3 second because showPassUI is exactly 3 second
          return this.timeout(3);
        }
      })
      .then((arg) => {
        if (!arg) {
          this.closeGuessNumberUI();
          this.closePassUI();

          // update next order(go to next player)
          this.checkOrderAndUpdate();
        }
      });
  }

  computerGuessNumberLogic() {
    /*
    first check computer if is out of tool counts
    if yes, lose game
    then check if computer wants use tool
    */
    if (
      this.checkComputerUseToolCounts(this.allPlayerArr[this.currentOrder]) ||
      this.checkIfComputerUseTool()
    ) {
      // lose game
      return false;
    }

    // use tool
    return true;
  }

  checkIfComputerUseTool() {
    // if remaining only one guess number, defenitely use tool
    if (this.maxNumber - this.minNumber === 2) return false;

    // randomly decide if using the tools
    const randomNum = this.createRandomNumber(1, 100);
    if (randomNum % 2 === 0) return true;
    else return false;
  }

  checkComputerUseToolCounts(player) {
    if (player.toolCounts === 0) return true;
    player.toolCounts--;
    return false;
  }

  useToolComputer() {
    // check current player(country)
    const currentCountryName = this.allPlayerArr[this.currentOrder].countryName;
    const tool = this.whichToolComputer();

    this.useToolLogic(tool, currentCountryName);
  }

  whichToolComputer() {
    const randomNumberTool = this.createRandomNumber(0, 2);

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

  useToolLogic(tool, playerName) {
    this.timeout(0)
      .then(() => {
        this.toolFunctionality(tool);
      })
      .then(() => {
        this.showUseToolUI(tool, playerName);

        return this.timeout(3);
      })
      .then(() => {
        // later, close whole UI
        this.closeUseToolUI();

        // next round
        this.checkOrderAndUpdate();
      });
  }

  toolFunctionality(tool) {
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

    /*
    If html has popup__assign__select element
    It means it's the time user using the assign 
    */
    if (assignOrder) {
      this.currentOrder = assignOrder.value;
    }
    // computer use assign
    else {
      // avoid assign itself
      let randomNumAssign;

      while (true) {
        randomNumAssign = this.createRandomNumber(0, this.allPlayerArr.length);

        /*
        edge case
        This is when current player is the last player
        And it's in reverse order
        At this point, this player cannot assign 0
        Because 0 - 1(reverse) = -1
        And later it will automatically set back to this.allPlayerArr.length - 1
        Which is the situation assign itself
        */
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
        because later will immediately subtract one on current order, then it will back to itself
        same for non-reverse
        */
        if (this.reverse) {
          if (randomNumAssign !== this.currentOrder + 1) break;
        } else if (randomNumAssign !== this.currentOrder - 1) break;
      }

      this.currentOrder = randomNumAssign;
    }
  }

  ///////////////////////////////////////
  // *** Computer Guessing Number ***
  ///////////////////////////////////////
  createComputerGuessingNumber(min, max) {
    return this.createRandomNumber(min + 1, max - 1);
  }

  ///////////////////////////////////////
  // *** Show Use Tool UI ***
  ///////////////////////////////////////
  showUseToolUI(tool, player) {
    // re-position based on the length of county name
    if (player.length >= 20) {
      DOM.guessUseTool.style.top = "78%";
      DOM.guessUseToolUserName.style.top = "43%";
    } else DOM.guessUseTool.style.top = "55%";

    // set tool html and icon
    const useToolHTML = `use ${tool}`;
    const toolIcon =
      tool === "ASSIGN"
        ? SVG.assignImg
        : tool === "PASS"
        ? SVG.passImg
        : SVG.uturnImg;

    // show tool html and icon on UI
    DOM.guessUseToolUserName.textContent = `${player}`;
    DOM.guessUseTool.textContent = useToolHTML;
    DOM.guessUseTool.insertAdjacentHTML("beforeend", toolIcon);

    // close popup (only need to close if it's user using the tool)
    if (player === this.userCountryInfo.countryName) this.closePopupUseTool();

    // add class for animation
    DOM.guessUseToolUserName.classList.add("guess__tool--animation");
    DOM.guessUseTool.classList.add("guess__tool--animation");
  }

  closeUseToolUI() {
    /*
    have to first remove the tool icon, then empty the text content(guessUseTool)
    because tool icon is inside the guessUseTool <p>  <svg></svg> </p>
    */
    DOM.guessUseTool.removeChild(document.querySelector(".guess__tool__icon"));
    DOM.guessUseToolUserName.classList.remove("guess__tool--animation");
    DOM.guessUseTool.classList.remove("guess__tool--animation");
    DOM.guessUseToolUserName.textContent = "";
    DOM.guessUseTool.textContent = "";
  }

  ///////////////////////////////////////
  // *** Use Tool ***
  ///////////////////////////////////////
  useTool(e) {
    this.userCountryInfo.toolCounts--;

    // reset all counts UI
    DOM.remaingCounts.forEach(
      (count) => (count.textContent = this.userCountryInfo.toolCounts)
    );

    // close "Your turn" UI
    this.closePlayerOrderUI();

    // close guess input UI
    this.closeGuessInput();

    // close tool UI
    this.toolBtnToggle();

    // not my turn anymore
    this.myTurn = false;

    // close countdown
    this.closeCountDown();

    // close check button
    DOM.btnGuessInput.classList.add("hidden--display");

    // get the used tool
    const tool = e.target
      .closest(".popup__tool__use")
      .querySelector(".popup__tool__use__icon").dataset.id;

    this.useToolLogic(tool, this.userCountryInfo.countryName);
  }

  ///////////////////////////////////////
  // *** Computer Lose Game ***
  ///////////////////////////////////////
  computerLoseGame() {
    // blur lose image
    this.blurCountryImg();

    // show popup UI
    this.showPopupComputerLoseGame();

    // add user tool counts
    this.userCountryInfo.toolCounts++;

    // show remaining counts of tool
    DOM.remaingCounts.forEach(
      (count) => (count.textContent = this.userCountryInfo.toolCounts)
    );
  }

  showPopupComputerLoseGame() {
    this.showPopupOverlay();
    DOM.popupComputerLoseGame.classList.remove("hidden--display");

    // show which conutry(player) lose the game
    DOM.popupComputerLoseGameCountryName.textContent =
      this.allPlayerArr[this.currentOrder].countryName;

    // show bomb number
    DOM.bombNumberComputer.textContent = this.targetNumber;
  }

  closePopupComputerLoseGame() {
    this.closePopupOverlay();
    DOM.popupComputerLoseGame.classList.add("hidden--display");

    // hide bomb number
    DOM.bombNumberComputer.textContent = "";

    // eliminate player
    this.eliminatePlayerAndReset(this.currentOrder);
    this.checkOrderAndUpdate();
  }

  eliminatePlayerAndReset(playerNumber) {
    const playerElement = this.allPlayerArr[playerNumber];

    const newPlayerArr = this.deleteElementFromArray(
      this.allPlayerArr,
      playerElement
    );

    // reset all player array
    this.allPlayerArr = newPlayerArr;

    this.resetNumberRange();

    // reset target number
    this.createTargetNumber();

    this.nextPlayerAfterElimination();
  }

  resetNumberRange() {
    this.minNumber = 0;
    this.maxNumber = this.maxNumberNoChange;

    // set range number on UI
    DOM.rangeNumberMax.textContent = this.maxNumber;
    DOM.rangeNumberMin.textContent = this.minNumber;
  }

  blurCountryImg() {
    const losingCountryOrder = this.allPlayerArr[this.currentOrder].order;

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

  /*
  Here, we make sure the next player is correct
  If now it's not reverse, we have to let order be the previose one
  Because later will increase one and this.allPlayerArr is change too
  If it's reverse, then do nothing
  (try to graph and think)

  Imagine the current eliminated player is player 1
  So the length of allPlayerArr = 4 - 1 = 3 [0, 1, 2]
  In normal case, the next player should still be 1
  Why?
  Because the player 1 is the original player 2 after elimination
  Without this function
  After eliminating player 1, the next player would skip the player 2
  Because current order 1 + 1 = 2
  And the allPlayerArr is [0, 1, 2] after elimination
  */
  nextPlayerAfterElimination() {
    if (!this.reverse) {
      this.currentOrder = this.currentOrder - 1;
    }
  }

  ///////////////////////////////////////
  // *** Update Min & Max Range ***
  ///////////////////////////////////////
  updateMinMaxRange(guessNumber) {
    // change max number and show UI
    if (guessNumber > this.targetNumber) {
      this.maxNumber = guessNumber;
      this.showRangeNumberMaxUI(guessNumber);
    }

    // change min number and show UI
    else if (guessNumber < this.targetNumber) {
      this.minNumber = guessNumber;
      this.showRangeNumberMinUI(guessNumber);
    }
  }

  ///////////////////////////////////////
  // *** Range Number Min & Max UI ***
  ///////////////////////////////////////
  showRangeNumberMinUI(min) {
    DOM.rangeNumberMin.textContent = min;
    DOM.rangeNumberMin.classList.add("range__number--animation");

    // remove animation class after animation
    this.timeout(4).then(() =>
      DOM.rangeNumberMin.classList.remove("range__number--animation")
    );
  }

  showRangeNumberMaxUI(max) {
    DOM.rangeNumberMax.textContent = max;
    DOM.rangeNumberMax.classList.add("range__number--animation");

    // remove animation class after animation
    this.timeout(4).then(() =>
      DOM.rangeNumberMax.classList.remove("range__number--animation")
    );
  }

  ///////////////////////////////////////
  // *** Guess Number UI ***
  ///////////////////////////////////////
  showGuessNumberUI(number) {
    DOM.guessNumber.textContent = number;
    DOM.guessNumber.classList.remove("hidden--opacity");
    DOM.guessNumber.classList.add("guess__number--animation");
  }

  closeGuessNumberUI() {
    DOM.guessNumber.textContent = "";
    DOM.guessNumber.classList.add("hidden--opacity");
    DOM.guessNumber.classList.remove("guess__number--animation");
  }

  showPassUI() {
    DOM.guessNumber.textContent = "PASS";
    DOM.guessNumber.classList.add("pass--animation");
  }

  closePassUI() {
    DOM.guessNumber.textContent = "";
    DOM.guessNumber.classList.remove("pass--animation");
  }

  // // !!! about to remove?? !!!
  // ///////////////////////////////////////
  // // *** POPUP INVAID INPUT ***
  // ///////////////////////////////////////
  // showPopupInvalidInput() {
  //   this.showPopupOverlay();
  //   DOM.popupInvalidInput.classList.remove("hidden--display");

  //   this.timeout(0).then(() =>
  //     DOM.popupInvalidInput.classList.remove("hidden--opacity")
  //   );
  // }

  // closePopupInvalidInput() {
  //   this.closePopupOverlay();
  //   DOM.popupInvalidInput.classList.add("hidden--display");

  //   DOM.popupInvalidInput.classList.add("hidden--opacity");

  //   this.showPlayerOrderUI("Your turn");
  // }

  ///////////////////////////////////////
  // *** Show & Close Guess Input ***
  ///////////////////////////////////////
  showGuessInput() {
    DOM.guessInput.classList.remove("hidden--display");
  }

  closeGuessInput() {
    DOM.guessInput.classList.add("hidden--display");
    DOM.guessInput.value = "";
  }

  ///////////////////////////////////////
  // *** Player Order UI ***
  ///////////////////////////////////////
  showPlayerOrderUI(order) {
    DOM.guessOrder.textContent = order;
    DOM.guessOrder.classList.add("player--animation");
  }

  closePlayerOrderUI() {
    DOM.guessOrder.textContent = "";
    DOM.guessOrder.classList.remove("player--animation");
  }

  ///////////////////////////////////////
  // *** Computer Waiting UI ***
  ///////////////////////////////////////
  showComputerWaitingUI(playerCountry) {
    DOM.guessOrder.textContent = playerCountry;

    DOM.waiting.forEach((wait) => wait.classList.remove("hidden--display"));
    DOM.bounce1.classList.add("spinner--animation1");
    DOM.bounce2.classList.add("spinner--animation2");
    DOM.bounce3.classList.add("spinner--animation3");
  }

  closeComputerWaitingUI() {
    DOM.guessOrder.textContent = "";

    DOM.waiting.forEach((wait) => wait.classList.add("hidden--display"));
    DOM.bounce1.classList.remove("spinner--animation1");
    DOM.bounce2.classList.remove("spinner--animation2");
    DOM.bounce3.classList.remove("spinner--animation3");
  }

  ///////////////////////////////////////
  // *** Button Tool ***
  ///////////////////////////////////////
  showTool() {
    DOM.btnToolUse.forEach((element) => {
      element.disabled = false;
    });

    DOM.toolContainer.style.height = "20rem";

    DOM.toolContainer.classList.remove("hidden--opacity");

    DOM.toolItem.forEach((element) => {
      element.classList.remove("hidden--opacity");
    });
  }

  closeTool() {
    DOM.toolContainer.style.height = "0";

    DOM.toolContainer.classList.add("hidden--opacity");

    DOM.toolItem.forEach((element) => {
      element.classList.add("hidden--opacity");
    });

    DOM.btnToolUse.forEach((element) => {
      element.disabled = true;
    });
  }

  toolBtnToggle() {
    if (this.btnToolToggle) {
      this.showTool();
      this.btnToolToggle = false;
    } else {
      this.closeTool();
      this.btnToolToggle = true;
    }
  }

  ///////////////////////////////////////
  // *** Country Info ***
  ///////////////////////////////////////
  showCountryInfo(e) {
    this.chooseCountryInfo(Number(e.target.dataset.id));

    DOM.countryInfo.classList.remove("hidden--display");

    this.timeout(0).then(() =>
      DOM.countryInfo.classList.remove("hidden--opacity")
    );
  }

  closeCountryInfo() {
    document.querySelector(".info").classList.add("hidden--display");

    this.timeout(0).then(() =>
      document.querySelector(".info").classList.add("hidden--opacity")
    );
  }

  chooseCountryInfo(order) {
    const countryName = this.allPlayerArrNoChange[order].countryName;
    const contryElement = document.querySelector(".info__name");

    // resize font size
    if (countryName.length >= 30) contryElement.style.fontSize = "2rem";
    else if (countryName.length >= 20 && countryName.length < 30)
      contryElement.style.fontSize = "3rem";
    else if (countryName.length >= 10 && countryName.length < 20)
      contryElement.style.fontSize = "4rem";
    else contryElement.style.fontSize = "5rem";
    contryElement.textContent = this.allPlayerArrNoChange[order].countryName;

    // manually set country info
    document.querySelector(".info__region").textContent =
      this.allPlayerArrNoChange[order].countryData?.region || "NO PROVIDED";
    document.querySelector(".info__capital").textContent =
      this.allPlayerArrNoChange[order].countryData?.capital[0] || "NO PROVIDED";
    document.querySelector(".info__area").textContent =
      this.convertNumberToString(
        this.allPlayerArrNoChange[order].countryData?.area
      ) || "NO PROVIDED";
    document.querySelector(".info__population").textContent =
      this.convertNumberToString(
        this.allPlayerArrNoChange[order].countryData?.population
      ) || "NO PROVIDED";
    document.querySelector(".info__currencies").textContent = this
      .allPlayerArrNoChange[order].countryData?.currencies
      ? Object.keys(this.allPlayerArrNoChange[order].countryData?.currencies)[0]
      : "NO PROVIDED";

    document.querySelector(".info__language").textContent =
      Object.values(
        this.allPlayerArrNoChange[order].countryData?.languages
      )[0] || "NO PROVIDED";
  }

  convertNumberToString(num) {
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
  // *** Menu BackGround ***
  ///////////////////////////////////////
  // showMenuBackground() {
  //   DOM.navBackground.classList.remove("hidden--display");

  //   DOM.btnNavBackground.forEach((element) => {
  //     element.classList.remove("hidden--display");
  //   });

  //   this.timeout(0)
  //     .then(() => {
  //       DOM.navBackground.style.height = "100vh";

  //       DOM.navBackground.classList.remove("hidden--opacity");
  //     })
  //     .then(() =>
  //       DOM.btnNavBackground.forEach((element) => {
  //         element.classList.remove("hidden--opacity");
  //       })
  //     );
  // }

  // closeMenuBackground() {
  //   DOM.navBackground.style.height = "1vh";

  //   DOM.navBackground.classList.add("hidden--opacity");

  //   this.timeout(0)
  //     .then(() =>
  //       DOM.btnNavBackground.forEach((element) => {
  //         element.classList.add("hidden--opacity");
  //       })
  //     )
  //     .then(() => {
  //       DOM.navBackground.classList.add("hidden--display");

  //       DOM.btnNavBackground.forEach((element) => {
  //         element.classList.add("hidden--display");
  //       });
  //     });
  // }

  // menuCheckboxToggle() {
  //   if (this.btnMenuToggle) {
  //     this.showMenuBackground();
  //     this.btnMenuToggle = false;
  //   } else {
  //     this.closeMenuBackground();
  //     this.btnMenuToggle = true;
  //   }
  // }

  ///////////////////////////////////////
  // *** Popup Overlay ***
  ///////////////////////////////////////
  showPopupOverlay() {
    DOM.popupOverlay.classList.remove("hidden--display");
  }

  closePopupOverlay() {
    DOM.popupOverlay.classList.add("hidden--display");
  }

  ///////////////////////////////////////
  // *** Close All Popup ***
  ///////////////////////////////////////
  // add one callback function to different close button
  // use .closest to check which popup should close
  closePopup(e) {
    const targetElement = e.target;

    /*
    Note there are two situations to show the popup__tool
    1. In the popup__question(in the form & during the game)
    2. In the tool button question(?)

    In the popup__question
    we wanna show the popup__question again after closing the popup__tool
    However, in the tool button question(?)
    we wanna directly close the popup__tool

    In order to fix the logic
    Initialize this.btnToolQuestion to false
    If clicking tool button question(?) to open the popup__tool
    set it to true
    So when closing the popup__tool, it won't show the popup__question
    akso need to set back to false
    (else condition)
    If clicking popup__question
    We wanna show it again after closing popup__tool
    */
    if (!this.btnToolQuestion)
      DOM.popupQuestion.classList.remove("hidden--display");
    else {
      this.btnToolQuestion = false;
      this.closePopupOverlay();
    }

    // question
    if (targetElement.closest(".popup__question")) {
      targetElement
        .closest(".popup__question")
        .classList.add("hidden--display");
    }

    // rule
    if (targetElement.closest(".popup__rule")) {
      targetElement.closest(".popup__rule").classList.add("hidden--display");
    }

    // diff level
    if (targetElement.closest(".popup__level__diff")) {
      targetElement
        .closest(".popup__level__diff")
        .classList.add("hidden--display");
    }

    // tool
    if (targetElement.closest(".popup__tool")) {
      targetElement.closest(".popup__tool").classList.add("hidden--display");
    }
  }

  ///////////////////////////////////////
  // *** Popup Level ***
  ///////////////////////////////////////
  showPopupLevel(e) {
    this.showPopupOverlay();

    DOM.popupLevel.classList.remove("hidden--display");

    this.timeout(0).then(() => {
      DOM.popupLevel.classList.remove("hidden--opacity");
    });
  }

  closePopupLevel() {
    this.closePopupOverlay();

    DOM.popupLevel.classList.add("hidden--display");
    DOM.popupLevel.classList.add("hidden--opacity");
  }

  changeLevel() {
    location.reload();
  }

  ///////////////////////////////////////
  // *** Popup Question ***
  ///////////////////////////////////////
  showPopupQuestion() {
    this.showPopupOverlay();
    DOM.popupQuestion.classList.remove("hidden--display");

    this.timeout(0).then(() =>
      DOM.popupQuestion.classList.remove("hidden--opacity")
    );
  }

  closePopupQuestion() {
    if (!this.targetNumber) {
      this.closePopupQuestionInForm();
    } else {
      this.closePopupOverlay();
      DOM.popupQuestion.classList.add("hidden--display");
      DOM.popupQuestion.classList.add("hidden--opacity");
    }
  }

  showPopupQuestionInForm() {
    this.showPopupOverlay();
    DOM.popupQuestion.classList.remove("hidden--display");

    DOM.formRange.classList.add("hidden--display");
    DOM.formOverlay.classList.add("hidden--display");
  }

  closePopupQuestionInForm() {
    this.closePopupOverlay();
    DOM.popupQuestion.classList.add("hidden--display");

    DOM.formRange.classList.remove("hidden--display");
    DOM.formOverlay.classList.remove("hidden--display");
  }

  ///////////////////////////////////////
  // *** Popup Different Question (Rule, Level, Tool) ***
  ///////////////////////////////////////
  // use one callback function attach on one enitre question pop up
  // use .contains to check what button is user currently clicking
  showPopupDiffQuestion(e) {
    const targetElement = e.target;

    if (targetElement.classList.contains("btn__popup__question")) {
      DOM.popupQuestion.classList.add("hidden--display");

      if (targetElement.classList.contains("btn__popup__question__rule")) {
        DOM.popupRule.classList.remove("hidden--display");
      }

      if (targetElement.classList.contains("btn__popup__question__level")) {
        DOM.popupDiffLevel.classList.remove("hidden--display");
      }

      if (targetElement.classList.contains("btn__popup__question__tool")) {
        DOM.popupTool.classList.remove("hidden--display");
      }
    }
  }

  ///////////////////////////////////////
  // *** Popup Use Tool ***
  ///////////////////////////////////////
  showPopupUseTool(e) {
    // first check if it's user's turn
    if (!this.myTurn) {
      this.showPopupCantUseTool();
      return;
    }

    // then check counts if can use tool
    if (this.userCountryInfo.toolCounts === 0) {
      this.showPopupCantUseTool(true);
      return;
    }

    // okay, user can use tool, hide popup use tool
    this.showPopupOverlay();
    DOM.popupUseTool.classList.remove("hidden--display");

    this.showPopupUseToolUI(e.target.closest(".btn__tool--use").dataset.id);
  }

  closePopupUseTool() {
    DOM.popupUseTool.classList.add("hidden--opacity");
    DOM.popupUseToolDescription.style.fontSize = "2.5rem";

    this.timeout(0).then(() => {
      this.closePopupOverlay();
      DOM.popupUseTool.classList.add("hidden--display");
    });

    /*
    remove the svg icon in every time closing
    can't use DOM.popupUseToolIcon
    because there is no html element at the time we invoking the DOM__SELECTION
    so DOM.popupUseToolIcon === null
    popup__tool__use__icon is in the svgIcon
    which is added in the showPopupUseToolUI below
    SVG.assign, SVG.pass, SVG.uturn
    */
    document.querySelector(".popup__tool__use__icon").remove();

    /*
    also remove assign UI
    have to first check if element exist
    */
    document.querySelector(".popup__subtitle--assign") !== null &&
      document.querySelector(".popup__subtitle--assign").remove();
    document.querySelector(".popup__assign__select") !== null &&
      document.querySelector(".popup__assign__select").remove();
  }

  showPopupUseToolUI(tool) {
    // assign
    if (tool === "ASSIGN") {
      DOM.popupUseToolTitle.insertAdjacentHTML(
        "afterend",
        this.showPopupAssignUI()
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

    this.timeout(0).then(() =>
      DOM.popupUseTool.classList.remove("hidden--opacity")
    );
  }

  showPopupAssignUI() {
    // get current number of player (exclude user player)
    const currentPlayerNumber = this.allPlayerArr.length - 1;
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
    if (this.reverse) result = [2, 3, 4];
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
        this.allPlayerArr[i + 1].countryName
      }(${this.allPlayerArr[i + 1].position})</option>
      `;
    }

    html += `</select>`;

    return html;
  }

  ///////////////////////////////////////
  // *** If Screen Getting Smaller (Use Tool) ***
  ///////////////////////////////////////
  useToolSmall(e) {
    console.log(e.target);
    if (window.innerWidth <= 1200) {
      // first check if it's user's turn
      if (!this.myTurn) {
        this.showPopupCantUseTool();
        return;
      }

      // then check counts if can use tool
      if (this.userCountryInfo.toolCounts === 0) {
        this.showPopupCantUseTool(true);
        return;
      }

      // okay, user can use tool
      this.showPopupOverlay();
      DOM.popupUseTool.classList.remove("hidden--display");

      this.showPopupUseToolUI(e.target.dataset.id);
    }
  }

  ///////////////////////////////////////
  // *** Tool Extension Button (?) ***
  ///////////////////////////////////////
  showDiffToolUI() {
    this.showPopupOverlay();
    DOM.popupTool.classList.remove("hidden--display");
    this.btnToolQuestion = true;
  }

  ///////////////////////////////////////
  // *** Popup Can't Use Tool ***
  ///////////////////////////////////////
  showPopupCantUseTool(counts = false) {
    this.showPopupOverlay();

    // set content of different error
    if (counts) {
      DOM.popupCantUseToolDescription.textContent =
        "You ran out of the tool counts";
    } else {
      DOM.popupCantUseToolDescription.textContent =
        "can't use tool during other player's round";
    }

    DOM.popupCantUseTool.classList.remove("hidden--display");

    this.timeout(0).then(() =>
      DOM.popupCantUseTool.classList.remove("hidden--opacity")
    );
  }

  closePopupCantUseTool() {
    this.closePopupOverlay();
    DOM.popupCantUseTool.classList.add("hidden--display");
    DOM.popupCantUseTool.classList.add("hidden--opacity");
  }

  ///////////////////////////////////////
  // *** Pop Up User Lose Game ***
  ///////////////////////////////////////
  showPopupUserLoseGame() {
    this.showPopupOverlay();
    DOM.popupUserLoseGame.classList.remove("hidden--display");
    DOM.bombNumberUser.textContent = this.targetNumber;

    // only user lose the game, add eventlistenr on reload btn
    document
      .querySelector(".btn__popup__restart--lose")
      .addEventListener("click", () => {
        location.reload();
      });
  }

  ///////////////////////////////////////
  // *** User Win The Game ***
  ///////////////////////////////////////
  showPopupUserWinGame() {
    this.showPopupOverlay();
    DOM.popupUserWinGame.classList.remove("hidden--display");
    document.querySelector(".popup__userWinGame__currentLevel").textContent =
      this.level;

    document
      .querySelector(".btn__popup__restart--win")
      .addEventListener("click", function () {
        location.reload();
      });
  }

  ///////////////////////////////////////
  // *** Random Number ***
  ///////////////////////////////////////
  createRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ///////////////////////////////////////
  // *** Create Target Number ***
  ///////////////////////////////////////
  createTargetNumber() {
    this.targetNumber = this.createRandomNumber(1, this.maxNumber - 1);
    console.log(this.targetNumber);
  }

  ///////////////////////////////////////
  // *** Delete Element From Array ***
  ///////////////////////////////////////
  deleteElementFromArray(arr, element) {
    return arr.filter((el) => el !== element);
  }

  ///////////////////////////////////////
  // *** Promisifying Settimeout ***
  ///////////////////////////////////////
  timeout(second) {
    return new Promise(function time(resolve) {
      setTimeout(resolve, second * 1000);
    });
  }

  debounce(ms, fn) {
    let timer;

    return function (...args) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        fn(...args);
      }, ms);
    };
  }

  ///////////////////////////////////////
  // *** Event Listener ***
  ///////////////////////////////////////
  addEventListener() {
    // TOOL
    DOM.btnTool.addEventListener("click", this.toolBtnToggle.bind(this));
    DOM.toolItemName.forEach((toolName) =>
      toolName.addEventListener("click", this.useToolSmall.bind(this))
    );

    // COUNTRY INFO
    DOM.btnCountryInfoClose.addEventListener(
      "click",
      this.closeCountryInfo.bind(this)
    );

    DOM.btnNavQuestion.addEventListener(
      "click",
      this.showPopupQuestion.bind(this)
    );

    DOM.btnPopupCloseQuestion.addEventListener(
      "click",
      this.closePopupQuestion.bind(this)
    );

    // COUNTRY INFO (SIDE WINDOW)
    DOM.btnInfo.forEach((btn) =>
      btn.addEventListener("click", this.showCountryInfo.bind(this))
    );

    // POP UP
    DOM.btnPopupClose.forEach((btnClose) =>
      btnClose.addEventListener("click", this.closePopup.bind(this))
    );

    // POPUP CURRENT LEVEL
    DOM.btnShowLevel.addEventListener("click", this.showPopupLevel.bind(this));
    DOM.btnPopupLevelNo.addEventListener(
      "click",
      this.closePopupLevel.bind(this)
    );

    // POPUP CHANGE LEVEL
    DOM.btnPopupLevelYes.addEventListener("click", this.changeLevel.bind(this));

    // POPUP QUESTION
    DOM.popupQuestion.addEventListener(
      "click",
      this.showPopupDiffQuestion.bind(this)
    );

    // TAKE USER'S GUESS INPUT
    DOM.btnGuessInput.addEventListener(
      "click",
      this.btnCheckClickHandler.bind(this)
    );
    DOM.guessInput.addEventListener(
      "input",
      this.inputChangeHandler.bind(this)
    );
    DOM.guessInput.addEventListener(
      "keypress",
      this.enterPressHandler.bind(this)
    );

    // USE TOOL
    DOM.btnToolUse.forEach((btn) =>
      btn.addEventListener("click", this.showPopupUseTool.bind(this))
    );
    DOM.btnPopupUseToolNo.addEventListener(
      "click",
      this.closePopupUseTool.bind(this)
    );
    DOM.btnPopupUseToolYes.addEventListener("click", this.useTool.bind(this));
    DOM.btnToolQuestion.forEach((btn) =>
      btn.addEventListener("click", this.showDiffToolUI.bind(this))
    );

    // POPUP CANT USE TOOL
    DOM.btnCantUseTool.addEventListener(
      "click",
      this.closePopupCantUseTool.bind(this)
    );

    // COMPUTER LOSE GAME
    DOM.btnPopupComputerLoseGame.addEventListener(
      "click",
      this.closePopupComputerLoseGame.bind(this)
    );

    // form username
    DOM.btnFormUserNameNext.addEventListener(
      "click",
      this.btnFormUserNameNextClickHandler.bind(this)
    );

    // FORM LEVEL
    DOM.formLevelInputGroup.addEventListener(
      "click",
      this.formInputLevelClickHandler.bind(this)
    );
    DOM.btnFormLevelNext.addEventListener(
      "click",
      this.btnFormLevelNextClickHandler.bind(this)
    );
    DOM.btnFormLevelBack.addEventListener(
      "click",
      this.backFormPage.bind(this)
    );

    // form country
    DOM.formCountryRegionSelect.addEventListener(
      "input",
      this.formCountryRegionSelectChangeHandler.bind(this)
    );
    DOM.formCountryNameSelect.addEventListener(
      "input",
      this.formCountryNameSelectChangeHandler.bind(this)
    );
    DOM.btnFormCountryNext.addEventListener(
      "click",
      this.btnFormCountryNextClickHandler.bind(this)
    );
    DOM.btnFormCountryBack.addEventListener(
      "click",
      this.backFormPage.bind(this)
    );
    DOM.formBtnCountryRandom.addEventListener(
      "click",
      this.btnRandomClickHandler.bind(this)
    );

    // form range
    DOM.btnFormRangeNext.addEventListener(
      "click",
      this.btnFormRangeNextClickHandler.bind(this)
    );
    DOM.btnFormRangeBack.addEventListener(
      "click",
      this.backFormPage.bind(this)
    );

    DOM.formRangeInput.addEventListener(
      "input",
      this.formRangeInputChangeHandler.bind(this)
    );

    DOM.btnFormCheckFaq.addEventListener(
      "click",
      this.showPopupQuestionInForm.bind(this)
    );
  }
}

const app = new APP();

/*
  showTool() {
    DOM.toolContainer.classList.remove("hidden--display");

    DOM.toolItem.forEach(function rmToolItemHidden(element) {
      element.classList.remove("hidden--display");
    });

    this.timeout(0)
      .then(() => {
        document.querySelector(".tool__container").style.height = "20rem";

        DOM.toolContainer.classList.remove("hidden--opacity");
      })
      .then(() => {
        DOM.toolItem.forEach(function rmToolItemHidden(element) {
          element.classList.remove("hidden--opacity");
        });
      });
  }

  closeTool() {
    DOM.toolContainer.style.height = "0";

    DOM.toolContainer.classList.add("hidden--opacity");

    DOM.toolItem.forEach(function rmToolItemHidden(element) {
      element.classList.add("hidden--opacity");
    });
  }
*/
