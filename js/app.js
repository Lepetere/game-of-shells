var APP = APP || {};

APP.UI = (function () {

  // 'constants'
  var SHELL_WIDTH = 150,
    SHELL_HEIGHT = 150,
    SHELL_MARGIN = 10,
    GAME_CONTAINER_SELECTOR = '#game-container',
    ACTION_BUTTON_SELECTOR = '.action-button',
    SHUFFLE_ANIMATION_DURATION = 250,
    NUMBER_OF_SHUFFLES = 8;

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
    initButton();
    initShellPositions();
  };

  var resetGame = function () {
    $(GAME_CONTAINER_SELECTOR).empty();
    shellContainers = [];
    shellPositions = [];
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
          duration: SHUFFLE_ANIMATION_DURATION,
          complete: function () {
            // shellPositionIndex == 0 to make sure the callback gets only executed once for every shuffle round
            if (counter == NUMBER_OF_SHUFFLES && shellPositionIndex == 0) {
              transitionToNextState();
            }
            else if (shellPositionIndex == 0) {
              shuffleOnce(transitionToNextState, counter + 1);
            }
          }
        });
        // also shift ball to new position
        if (shellPositionIndex == ballPositionIndex) {
          $(ballElement).animate(newPosition, SHUFFLE_ANIMATION_DURATION);
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
	
  function initButton () {
    $(ACTION_BUTTON_SELECTOR).click(APP.STATE_MACHINE.actionButtonClickHandler);
  }
	
  var module = {};
  module.init = init;
  module.initBallPosition = initBallPosition;
  module.makeShellsClickable = makeShellsClickable;
  module.unassignShellClickHandlers = unassignShellClickHandlers;
  module.resetGame = resetGame;
  module.initShellPositions = initShellPositions;
  module.shuffleShellPositions = shuffleShellPositions;
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
	
  var module = {};
  module.init = init;
  module.actionButtonClickHandler = actionButtonClickHandler;
  module.shellContainerClickHandler = shellContainerClickHandler;
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
    }
  }
};
