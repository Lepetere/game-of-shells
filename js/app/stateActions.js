var APP = APP || {};

// 'constants'
var ACTION_BUTTON_SELECTOR = '.action-button',
    INSTRUCTIONS_CONTAINER_SELECTOR = '.instruction-text';

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
  },

  hideballAction: function (transitionToNextState) {
    console.log("hideball");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty();
    $(ACTION_BUTTON_SELECTOR).hide();
    $('.ball-container').fadeOut(1000, transitionToNextState);
  },

  shuffleAction: function (transitionToNextState) {
    console.log("shuffle");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.shuffle);
    window.setTimeout(transitionToNextState, 2000);
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
    $('.ball-container').fadeIn(400);
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
