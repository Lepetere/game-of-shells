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
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.welcome);
    $(ACTION_BUTTON_SELECTOR).empty().append(APP.TRANSLATIONS.en.buttonlabels.welcome);
  },

  showballAction: function () {
    console.log("showball");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.showball);
    $(ACTION_BUTTON_SELECTOR).empty().append(APP.TRANSLATIONS.en.buttonlabels.showball);
    APP.UI.initBallPosition();
    $(BALL_CONTAINER_SELECTOR).fadeIn(BALL_SHOW_DURATION);
  },

  hideballAction: function (transitionToNextState) {
    console.log("hideball");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty();
    $(ACTION_BUTTON_SELECTOR).hide();
    $(BALL_CONTAINER_SELECTOR).fadeOut(BALL_HIDE_DURATION, transitionToNextState);
  },

  shuffleAction: function (transitionToNextState) {
    console.log("shuffle");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.shuffle);
    APP.UI.shuffleShellPositions(transitionToNextState);
  },

  guessAction: function () {
    console.log("guess");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.guess);
    APP.UI.makeShellsClickable();
  },

  guesswaswrongAction: function () {
    console.log("guesswaswrong");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.guesswaswrong);
  },

  guesswrongagainAction: function () {
    console.log("guesswrongagain");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.guesswrongagain);
  },

  guesswasrightAction: function () {
    console.log("guesswasright");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.guesswasright);
    $(ACTION_BUTTON_SELECTOR).empty().append(APP.TRANSLATIONS.en.buttonlabels.guesswasright);
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
