var APP = APP || {};

// 'constants'
var ACTION_BUTTON_SELECTOR = '.action-button',
    INSTRUCTIONS_CONTAINER_SELECTOR = '.instruction-text';

APP.STATE_ACTIONS = {
  welcomeAction: function () {
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.welcome);
    $(ACTION_BUTTON_SELECTOR).empty().append(APP.TRANSLATIONS.en.buttonlabels.welcome);
  },

  showballAction: function () {
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.showball);
    $(ACTION_BUTTON_SELECTOR).empty().append(APP.TRANSLATIONS.en.buttonlabels.showball);
    APP.UI.initBallPosition();
  },

  shuffleAction: function () {
    console.log("shuffle");
  },

  guessAction: function () {
    console.log("guess");
  },

  guesswaswrongAction: function () {
    console.log("guesswaswrong");
  },

  guesswasrightAction: function () {
    console.log("guesswasright");
  },

  playagainAction: function () {
    console.log("playagain");
  }
};
