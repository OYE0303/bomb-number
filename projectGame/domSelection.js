export class DOMSelection {
  constructor() {
    this.player = document.querySelectorAll(".player");
    this.playerMain = document.querySelector(".player__main");
    this.player1 = document.querySelector(".player1");
    this.player2 = document.querySelector(".player2");
    this.player3 = document.querySelector(".player3");
    this.playerOverlayMain = document.querySelector(".player__overlay__main");
    this.playerOverlay1 = document.querySelector(".player__overlay1");
    this.playerOverlay2 = document.querySelector(".player__overlay2");
    this.playerOverlay3 = document.querySelector(".player__overlay3");
    this.btnInfo = document.querySelectorAll(".btn__info");
    this.countryInfo = document.querySelector(".country__info");

    // *** TOOL ***
    this.btnTool = document.querySelector(".btn__tool");
    this.toolItem = document.querySelectorAll(".tool__item");
  }
}
