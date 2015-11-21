var APP = APP || {};

// 'constants'
var ACTION_BUTTON_SELECTOR = '.action-button',
    INSTRUCTIONS_CONTAINER_SELECTOR = '.instruction-text',
    BALL_CONTAINER_SELECTOR = '.ball-container',
    BALL_HIDE_DURATION = 800,
    BALL_SHOW_DURATION = 400;

APP.STATE_ACTIONS = {
  welcomeAction: function () {
    console.log("welcome");
    APP.TRANSLATE.translateInstruction();
    APP.TRANSLATE.translateActionButton();
  },

  showballAction: function () {
    console.log("showball");
    APP.TRANSLATE.translateInstruction();
    APP.TRANSLATE.translateActionButton();
    APP.UI.initBallPosition();
    $(BALL_CONTAINER_SELECTOR).fadeIn(BALL_SHOW_DURATION);
  },

  hideballAction: function (transitionToNextState) {
    console.log("hideball");
    $(ACTION_BUTTON_SELECTOR).hide();
    $(BALL_CONTAINER_SELECTOR).fadeOut(BALL_HIDE_DURATION, transitionToNextState);
  },

  shuffleAction: function (transitionToNextState) {
    console.log("shuffle");
    APP.TRANSLATE.translateInstruction();
    APP.UI.shuffleShellPositions(transitionToNextState);
  },

  guessAction: function () {
    console.log("guess");
    APP.TRANSLATE.translateInstruction();
    APP.UI.makeShellsClickable();
  },

  guesswaswrongAction: function () {
    console.log("guesswaswrong");
    APP.TRANSLATE.translateInstruction();
  },

  guesswrongagainAction: function () {
    console.log("guesswrongagain");
    APP.TRANSLATE.translateInstruction();
  },

  guesswasrightAction: function () {
    console.log("guesswasright");
    APP.TRANSLATE.translateInstruction();
    APP.TRANSLATE.translateActionButton();
    $(BALL_CONTAINER_SELECTOR).fadeIn(BALL_SHOW_DURATION);
    $(ACTION_BUTTON_SELECTOR).show();
    APP.UI.unassignShellClickHandlers();
  },

  playagainAction: function (transitionToNextState) {
    console.log("playagain");
    APP.UI.resetGame();
    APP.UI.initShellPositions();
    transitionToNextState();
  }
};
