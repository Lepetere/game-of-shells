var APP = APP || {};

APP.UI = (function () {

  // 'constants'
  var SHELL_WIDTH = 150,
    SHELL_HEIGHT = 150,
    SHELL_MARGIN = 10,
    GAME_CONTAINER_SELECTOR = '#game-container',
    ACTION_BUTTON_SELECTOR = '.action-button',
    INCREASE_SPEED_CONTROL_SELECTOR = '#increase-speed-control',
    DECREASE_SPEED_CONTROL_SELECTOR = '#decrease-speed-control',
    CURRENT_SPEED_DISPLAY_SELECTOR = '#current-speed',
    SWITCH_LANGUAGE_TO_ENGLISH_SELECTOR = '#switch-language-to-english',
    SWITCH_LANGUAGE_TO_GERMAN_SELECTOR = '#switch-language-to-german';

  var shellPositions, // array that will hold the positions of the three shell containers in the grid
    shellContainers, // array that will hold references to the shell container DOM elements
    ballElement, // will hold reference to ball (container) DOM element
    ballPositionIndex, // will hold index of the ball position corresponding to the indices in shellPositions & shellContainers
    ballPosition;

  // array that holds objects with top and left positions for a 3*3 square grid of shell containers
  var gridPositions = (function () {
    var returnArray = [];

    for ( var gridPositionCounter = 1; gridPositionCounter <= 9; gridPositionCounter ++ ) {
      var top = SHELL_HEIGHT * (Math.ceil(gridPositionCounter / 3) - 1) + SHELL_MARGIN * Math.ceil(gridPositionCounter / 3),
        left = SHELL_HEIGHT * ((gridPositionCounter - 1) % 3) + SHELL_MARGIN * (((gridPositionCounter - 1) % 3) + 1);

      returnArray.push({ top: top, left: left });
    }

    return returnArray;
  })();

  var init = function () {
    resetGame();
    initActionButton();
    initSpeedControls();
    initLanguageControls();
    initShellPositions();
  };

  var resetGame = function () {
    $(GAME_CONTAINER_SELECTOR).empty();
    shellContainers = [];
    shellPositions = [];
  };

  var displayCurrentSpeed = function (speedValue) {
    $(CURRENT_SPEED_DISPLAY_SELECTOR).empty().append(' (' + speedValue + ')');
  };

  // adds 3 shell containers at random grid positions and saves the positions
  var initShellPositions = function () {
    for ( var shellNumber = 1; shellNumber <= 3; shellNumber ++ ) {
      // find random position that is not taken yet
      var randomPositionToTest, randomPositionAlreadyTaken;
      do {
        randomPositionToTest = Math.ceil(Math.random() * 9);
        randomPositionAlreadyTaken = false;
        shellPositions.forEach(function (shellPosition) {
          if (shellPosition == randomPositionToTest) {
            randomPositionAlreadyTaken = true;
          }
        });
      } while ( randomPositionAlreadyTaken )

      var randomPosition = randomPositionToTest;
      shellPositions[shellNumber - 1] = randomPosition;

      var shellElement = $('<div id="shell-' + shellNumber + '" class="shell"></div>');
      shellContainers.push(shellElement);
      $(shellElement).offset(gridPositions[shellPositions[shellNumber - 1] - 1]);
      $(GAME_CONTAINER_SELECTOR).append(shellElement);
    }
  }

  var shuffleShellPositions = function (transitionToNextState) {
    var numberOfShuffles = APP.GAME_VARIABLES.getNumberOfShuffles(),
      shuffleAnimationDuration = APP.GAME_VARIABLES.getShuffleAnimationDuration();

    (function shuffleOnce (transitionToNextState, counter) {
      shellPositions.forEach(function (shellPosition, shellPositionIndex) {
        var newPositionIndex, newPosition;
        do {
          newPositionIndex = Math.floor(Math.random() * 9);
          newPosition = gridPositions[newPositionIndex];
          randomPositionAlreadyTaken = false;
          shellPositions.forEach(function (shellPosition) {
            if (shellPosition.left == newPosition.left && shellPosition.top == newPosition.top) {
              randomPositionAlreadyTaken = true;
            }
          });
        } while ( randomPositionAlreadyTaken )

        shellPositions[shellPositionIndex] = newPosition;
        $(shellContainers[shellPositionIndex]).animate(newPosition, {
          duration: shuffleAnimationDuration,
          complete: function () {
            // shellPositionIndex == 0 to make sure the callback gets only executed once for every shuffle round
            if (counter == numberOfShuffles && shellPositionIndex == 0) {
              transitionToNextState();
            }
            else if (shellPositionIndex == 0) {
              shuffleOnce(transitionToNextState, counter + 1);
            }
          }
        });
        // also shift ball to new position
        if (shellPositionIndex == ballPositionIndex) {
          $(ballElement).animate(newPosition, shuffleAnimationDuration);
        }
      });
    })(transitionToNextState, 1);
  };

  var makeShellsClickable = function () {
    shellContainers.forEach(function (element, index) {
      var shellNumber = index;
      $(element).addClass('clickable');
      $(element).click(function () {
        var wasRightGuess = ballPosition
        APP.STATE_MACHINE.shellContainerClickHandler(ballPositionIndex == index);
      });
    });
  };

  var unassignShellClickHandlers = function () {
    shellContainers.forEach(function (element, index) {
      $(element).removeClass('clickable');
      $(element).off("click");
    });
  };

  var initBallPosition = function () {
    if (shellPositions.length != 3) {
      throw new Error("Can't init ball position without first initializing the shell positions");
    }
    else {
      // choose one of shell grid positions and place the ball at the same position
      ballPositionIndex = Math.floor(Math.random() * 3);
      ballPosition = shellPositions[ballPositionIndex];
      ballElement = $('<div id="ball-container" class="ball-container"></div');
      ballElement.offset(gridPositions[ballPosition - 1]);
      ballElement.hide();
      ballElement.append('<div id="ball" class="ball"></div>');
      ballElement.addClass('over-shell');

      $(GAME_CONTAINER_SELECTOR).append(ballElement);
    }
  };
	
  function initActionButton () {
    $(ACTION_BUTTON_SELECTOR).click(APP.STATE_MACHINE.actionButtonClickHandler);
  }

  function initSpeedControls () {
    $(INCREASE_SPEED_CONTROL_SELECTOR).click(APP.GAME_VARIABLES.increaseSpeed);
    $(DECREASE_SPEED_CONTROL_SELECTOR).click(APP.GAME_VARIABLES.decreaseSpeed);
  }

  function initLanguageControls () {
    APP.TRANSLATE.translateSpeedControls();
    $(SWITCH_LANGUAGE_TO_ENGLISH_SELECTOR).append("EN").click(APP.TRANSLATE.switchLanguageToEnglish);
    $(SWITCH_LANGUAGE_TO_GERMAN_SELECTOR).append("DE").click(APP.TRANSLATE.switchLanguageToGerman);
  }
	
  var module = {};
  module.init = init;
  module.initBallPosition = initBallPosition;
  module.makeShellsClickable = makeShellsClickable;
  module.unassignShellClickHandlers = unassignShellClickHandlers;
  module.resetGame = resetGame;
  module.initShellPositions = initShellPositions;
  module.shuffleShellPositions = shuffleShellPositions;
  module.displayCurrentSpeed = displayCurrentSpeed;
  return module;
})();
;

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
;

$(document).ready(function () {
  APP.UI.init();
  APP.STATE_MACHINE.init();
});;

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
;

var APP = APP || {};

APP.STATE_MACHINE = (function () {

  // 'constants'
  var STATES = ['WELCOME', 'SHOWBALL', 'HIDEBALL', 'SHUFFLE', 'GUESS', 'GUESSWASWRONG', 'GUESSWRONGAGAIN', 'GUESSWASRIGHT', 'PLAYAGAIN'];

  var currentState;

  var init = function () {
    currentState = STATES[0];
    callStateAction(currentState);
  }

  function transitionToNextState () {
    var newState;
    if (currentState == STATES[STATES.length - 1]) { // last state, start with the first one again
      newState = STATES[1];
    }
    else if (currentState == 'GUESS') {
      var errorString = "Cannot automatically transition to next state from state 'GUESS'."
        + " Transition has to be made explicitely depending on right or wrong guess.";
      throw new Error(errorString);
    }
    else {
      STATES.forEach(function (state, stateIndex) {
        if (currentState == state) {
          newState = STATES[stateIndex + 1];
        }
      });
    }

    currentState = newState;
    callStateAction(newState);
  }

  function callStateAction (state) {
    if (typeof state != "string") {
      throw new Error("callStateAction must be called with a string as argument");
    }
    else {
      APP.STATE_ACTIONS[state.toLowerCase() + "Action"](transitionToNextState);
    }
  }

  var actionButtonClickHandler = function () {
    transitionToNextState();
  };

  // pass true to this handler if the user made the right guess, false otherwise
  var shellContainerClickHandler = function (wasRightGuess) {
    var newState;
    if (currentState == 'GUESSWASWRONG' && !wasRightGuess) {
      newState = 'GUESSWRONGAGAIN';
    }
    else {
      newState = wasRightGuess ? 'GUESSWASRIGHT' : 'GUESSWASWRONG'
    }
    currentState = newState;
    callStateAction(newState);
  };

  var getCurrentState = function () {
    return currentState;
  };
	
  var module = {};
  module.init = init;
  module.actionButtonClickHandler = actionButtonClickHandler;
  module.shellContainerClickHandler = shellContainerClickHandler;
  module.getCurrentState = getCurrentState;
  return module;
})();
;

var APP = APP || {};

APP.TRANSLATE = (function () {

  // default language is english
  var currentLanguage = 'en';

  // 'constants'
  var ACTION_BUTTON_SELECTOR = '.action-button',
    INSTRUCTIONS_CONTAINER_SELECTOR = '.instruction-text',
    INCREASE_SPEED_CONTROL_SELECTOR = '#increase-speed-control',
    DECREASE_SPEED_CONTROL_SELECTOR = '#decrease-speed-control';

  var switchLanguageToEnglish = function () {
    switchLanguage("en");
  };

  var switchLanguageToGerman = function () {
    switchLanguage("de");
  };

  var translateInstruction = function () {
    var lookupCode = APP.STATE_MACHINE.getCurrentState().toLowerCase(),
      translation = APP.TRANSLATIONS[currentLanguage].instructions[lookupCode];

    if (translation) {
      $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(translation);
    }
    else {
      console.log("no instruction translation found for state " + lookupCode);
    }
  };

  var translateActionButton = function () {
    var lookupCode = APP.STATE_MACHINE.getCurrentState().toLowerCase(),
      translation = APP.TRANSLATIONS[currentLanguage].buttonlabels[lookupCode];

    if (translation) {
      $(ACTION_BUTTON_SELECTOR).empty().append(translation);
    }
    else {
      console.log("no button translation found for state " + lookupCode);
    }
  };

  var translateSpeedControls = function () {
    var translationIncrease = APP.TRANSLATIONS[currentLanguage].controls.increasespeed,
      translationDecrease = APP.TRANSLATIONS[currentLanguage].controls.decreasespeed;
    
    $(INCREASE_SPEED_CONTROL_SELECTOR).empty().append(translationIncrease);
    $(DECREASE_SPEED_CONTROL_SELECTOR).empty().append(translationDecrease);
  };

  function switchLanguage (languageCode) {
    console.log("switching language to '" + languageCode + "'");
    currentLanguage = languageCode;
    translateInstruction();
    translateActionButton();
    translateSpeedControls();
  }

  var module = {};
  module.switchLanguageToEnglish = switchLanguageToEnglish;
  module.switchLanguageToGerman = switchLanguageToGerman;
  module.translateInstruction = translateInstruction;
  module.translateActionButton = translateActionButton;
  module.translateSpeedControls = translateSpeedControls;
  return module;
})();
;

var APP = APP || {};

APP.TRANSLATIONS = {
  "en": {
    "instructions": {
      "welcome": "Welcome to the Game of Shells!",
      "showball": "Do you see the red ball? Pay attention to where it's hidden!",
      "shuffle": "Shuffling...",
      "guess": "Can you guess where the ball is?",
      "guesswaswrong": "No, that's not where the ball is...",
      "guesswrongagain": "Try again.",
      "guesswasright": "That's right, the ball is here! Do you want to play again?"
    },
    "buttonlabels": {
      "welcome": "Start the game!",
      "showball": "Got it, now shuffle!",
      "guesswasright": "Yes, let's go!"
    },
    "controls": {
      "increasespeed": "increase speed",
      "decreasespeed": "decrease speed"
    }
  },
  "de": {
    "instructions": {
      "welcome": "Wilkommen beim Hütchenspiel!",
      "showball": "Siehst du den roten Ball? Merk dir genau, wo er ist!",
      "shuffle": "Mischen...",
      "guess": "Weißt du noch, wo der Ball ist?",
      "guesswaswrong": "Nein, leider nicht hier...",
      "guesswrongagain": "Versuch es noch einmal.",
      "guesswasright": "Ja genau, hier ist er! Möchtest du noch einmal spielen?"
    },
    "buttonlabels": {
      "welcome": "Leg los!",
      "showball": "Alles klar, ich bin bereit!",
      "guesswasright": "Nächste Runde"
    },
    "controls": {
      "increasespeed": "schneller mischen",
      "decreasespeed": "langsamer mischen"
    }
  }
};
