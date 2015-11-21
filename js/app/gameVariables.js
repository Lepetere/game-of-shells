var APP = APP || {};

APP.GAME_VARIABLES = (function () {

  // 'constants'
  var SHUFFLE_ANIMATION_DURATION_INCREMENT = 50;

  // set defaults
  var shuffleAnimationDuration = 250,
    numberOfShuffles = 8;

  var increaseSpeed = function () {
    var logMessage;

    if (shuffleAnimationDuration <= 50) {
      logMessage = "cannot increase speed any further";
    }
    else {
      shuffleAnimationDuration = shuffleAnimationDuration - SHUFFLE_ANIMATION_DURATION_INCREMENT;
      numberOfShuffles = numberOfShuffles + 1;

      logMessage = "shuffleAnimationDuration decreased to " + shuffleAnimationDuration
      + " and numberOfShuffles increased to " + numberOfShuffles;
    }

    console.log(logMessage);
    APP.UI.displayCurrentSpeed(numberOfShuffles);
  };

  var decreaseSpeed = function () {
    var logMessage;

    if (numberOfShuffles == 1) {
      logMessage = "cannot decrease speed any further";
    }
    else {
      shuffleAnimationDuration = shuffleAnimationDuration + SHUFFLE_ANIMATION_DURATION_INCREMENT;
      numberOfShuffles = numberOfShuffles - 1;

      logMessage = "shuffleAnimationDuration increased to " + shuffleAnimationDuration
        + " and numberOfShuffles decreased to " + numberOfShuffles;
    }
    
    console.log(logMessage);
    APP.UI.displayCurrentSpeed(numberOfShuffles);
  };

  var getShuffleAnimationDuration = function () {
    if (! typeof shuffleAnimationDuration == "number") {
      throw new Error("shuffleAnimationDuration is not a number");
    }
    else {
      return shuffleAnimationDuration;
    }
  };

  var getNumberOfShuffles = function () {
    if (! typeof numberOfShuffles == "number") {
      throw new Error("numberOfShuffles is not a number");
    }
    else {
      return numberOfShuffles;
    }
  };

  var module = {};
  module.increaseSpeed = increaseSpeed;
  module.decreaseSpeed = decreaseSpeed;
  module.getShuffleAnimationDuration = getShuffleAnimationDuration;
  module.getNumberOfShuffles = getNumberOfShuffles;
  return module;
})();
