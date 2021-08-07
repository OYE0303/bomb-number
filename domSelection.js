export class DOM_SELECTION {
  constructor() {
    this.remaingCounts = document.querySelectorAll(".remaing__counts");
    ///////////////////////////
    // *** NAV BAR ***
    ///////////////////////////
    this.userName = document.querySelector(".nav__username");
    this.navBackground = document.querySelector(".nav__background");
    this.btnNavBackground = document.querySelectorAll(".btn__nav--background");
    this.navCheckbox = document.querySelector(".nav__checkbox");
    this.btnNavQuestion = document.querySelector(".btn__nav__question");

    // event degelation
    this.navSecond = document.querySelector(".nav__second");

    ///////////////////////////
    // *** MAIN CONTENT ***
    ///////////////////////////
    this.player = document.querySelectorAll(".player");
    this.playerMain = document.querySelector(".player--main");
    this.player1 = document.querySelector(".player--1");
    this.player2 = document.querySelector(".player--2");
    this.player3 = document.querySelector(".player--3");
    this.playerOverlayMain = document.querySelector(".player__overlay--main");
    this.playerOverlay1 = document.querySelector(".player__overlay--1");
    this.playerOverlay2 = document.querySelector(".player__overlay--2");
    this.playerOverlay3 = document.querySelector(".player__overlay--3");
    this.btnInfo = document.querySelectorAll(".btn__info");
    this.countryInfo = document.querySelector(".countryInfo");

    this.guessInput = document.querySelector(".guess__input");
    this.btnGuessInput = document.querySelector(".btn__guess__input");
    this.guessNumber = document.querySelector(".guess__number");
    this.guessOrder = document.querySelector(".guess__order");
    this.guessUseTool = document.querySelector(".guess__useTool");
    this.guessUseToolUserName = document.querySelector(
      ".guess__useTool__playerName"
    );

    this.rangeNumberMin = document.querySelector(".range__number__min");
    this.rangeNumberMax = document.querySelector(".range__number__max");

    ///////////////////////////
    // *** TOOL ***
    ///////////////////////////
    this.toolContainer = document.querySelector(".tool__container");
    this.btnTool = document.querySelector(".btn__tool");
    this.toolItem = document.querySelectorAll(".tool__item");
    this.btnToolUse = document.querySelectorAll(".btn__tool--use");
    this.btnToolQuestion = document.querySelectorAll(".btn__tool--question");

    ///////////////////////////
    // *** COUNTDOWN ***
    ///////////////////////////
    this.countdownTime = document.querySelector(".countdown__time");

    // *** SHOW LEVEL ***
    this.btnShowLevel = document.querySelector(".btn__showLevel");
    // *** COUNTRY INFO ***
    this.countryInfo = document.querySelector(".countryInfo");
    this.btnCountryInfoClose = document.querySelector(
      ".btn__countryInfo__close"
    );

    ///////////////////////////
    // *** POPUP ***
    ///////////////////////////
    this.popupOverlay = document.querySelector(".popup__overlay");
    this.btnPopupClose = document.querySelectorAll(".btn__popup__close");

    this.popupLevel = document.querySelector(".popup__level");
    this.popupRule = document.querySelector(".popup__rule");
    this.popupQuestion = document.querySelector(".popup__question");
    this.popupDiffLevel = document.querySelector(".popup__diffLevel");
    this.popupTool = document.querySelector(".popup__tool");

    this.btnPopupLevelNo = document.querySelector(".btn__popup__level--no");
    this.popupLose = document.querySelector(".popup__lose");
    this.popupLoseDescription = document.querySelector(
      ".popup__lose__description"
    );

    this.popupInvalidInput = document.querySelector(".popup__invalidInput");

    // use tool
    this.popupUseTool = document.querySelector(".popup__useTool");
    this.popupUseToolTitle = document.querySelector(".popup__useTool__title");
    this.popupUseToolIcon = document.querySelector(".popup__useTool__icon");
    this.btnPopupUseToolNo = document.querySelector(".btn__popup__useTool__no");
    this.btnPopupUseToolYes = document.querySelector(
      ".btn__popup__useTool__yes"
    );

    // use assign
    this.popupAssign = document.querySelector(".popup__assign");
    this.popupAssignSelect = document.querySelector(".popup__assign__select");
    this.btnPopupAssign = document.querySelector(".btn__popup__assign");
    this.popupUseToolDescription = document.querySelector(
      ".popup__useTool__description"
    );

    // CANT USE TOOL
    this.popupCantUseTool = document.querySelector(".popup__cantUseTool");
    this.btnCantUseTool = document.querySelector(".btn__popup__cantUseTool");
    this.popupCantUseToolDescription = document.querySelector(
      ".popup__cantUseTool__description"
    );

    // content
    this.page = document.querySelectorAll(".page");

    // FORM
    this.formInput = document.querySelector(".form__input");
    this.btnFormUserNameNext = document.querySelector(
      ".btn__form--username--next"
    );
    this.formOverlay = document.querySelector(".form__overlay");

    // FORM LEVEL
    this.formLevelInputGroup = document.querySelector(
      ".form__level__input__group"
    );
    this.formLevelInput = document.querySelectorAll(
      ".form__level__radio--input"
    );
    this.formLevelDescriptionCounts = document.querySelector(
      ".form__level__description--counts"
    );
    this.formLevelInput = document.querySelectorAll(
      ".form__level__radio--input"
    );
    this.btnFormLevelNext = document.querySelector(".btn__form--level--next");
    this.btnFormLevelBack = document.querySelector(".btn__form--level--back");

    // form country
    this.formCountryRegionSelect = document.querySelector(
      ".form__country__region__select"
    );
    this.formCountryNameSelect = document.querySelector(
      ".form__country__name__select"
    );
    this.formCountryImgContainer = document.querySelector(
      ".form__country__img__container"
    );
    this.formCountryImg = document.querySelector(".form__country__img");
    this.formCountryNameSelect = document.querySelector(
      ".form__country__name__select"
    );
    this.btnFormCountryNext = document.querySelector(
      ".btn__form--country--next"
    );
    this.btnFormCountryBack = document.querySelector(
      ".btn__form--country--back"
    );

    // form range
    this.formRangeInput = document.querySelector(".form__range__input");
    this.formRangeOutput = document.querySelector(".form__range__output");
    this.btnFormRangeNext = document.querySelector(".btn__form--range-next");
    this.btnFormRangeNext = document.querySelector(".btn__form--range-next");
    this.btnFormRangeBack = document.querySelector(".btn__form--range-back");
  }
}
