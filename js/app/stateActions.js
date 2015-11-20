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

  shuffleAction: function () {
    console.log("shuffle");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.shuffle);
  },

  guessAction: function () {
    console.log("guess");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.shuffle);
  },

  guesswaswrongAction: function () {
    console.log("guesswaswrong");
  },

  guesswasrightAction: function () {
    $(ACTION_BUTTON_SELECTOR).show();
    console.log("guesswasright");
  },

  playagainAction: function () {
    console.log("playagain");
  }
};
