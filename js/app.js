var APP = APP || {};

APP.UI = (function () {

  // 'constants'
  var SHELL_WIDTH = 150,
    SHELL_HEIGHT = 150,
    SHELL_MARGIN = 10,
    GAME_CONTAINER_SELECTOR = '#game-container',
    ACTION_BUTTON_SELECTOR = '.action-button';

  var shellPositions, // array that will hold the positions of the three shell containers in the grid
    shellContainers, // array that will hold references to the shell container DOM elements
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

  function resetGame () {
    $(GAME_CONTAINER_SELECTOR).empty();
    shellContainers = [];
    shellPositions = [];
  }

  // adds 3 shell containers at random grid positions and saves the positions
  function initShellPositions () {
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

  var makeShellsClickable = function () {
    shellContainers.forEach(function (element, index) {
      var shellNumber = index;
      $(element).addClass('clickable');
      $(element).click(function () {
        console.log("shell number " + shellNumber + " was clicked");
      });
    });
  }

  var unassignShellClickHandlers = function () {
    shellContainers.forEach(function (element, index) {
      $(element).removeClass('clickable');
      $(element).off("click");
    });
  }

  var initBallPosition = function () {
    if (shellPositions.length != 3) {
      throw new Error("Can't init ball position without first initializing the shell positions");
    }
    else {
      // choose one of shell grid positions and place the ball at the same position
      ballPosition = shellPositions[Math.floor(Math.random() * 3)];
      var ballElement = $('<div id="ball-container" class="ball-container"></div');
      ballElement.offset(gridPositions[ballPosition - 1]);
      ballElement.append('<div id="ball" class="ball"></div>');
      ballElement.addClass('over-shell');

      $(GAME_CONTAINER_SELECTOR).append(ballElement);
    }
  }
	
  function initButton () {
    $(ACTION_BUTTON_SELECTOR).click(APP.STATE_MACHINE.actionButtonClickHandler);
  };
	
  var module = {};
  module.init = init;
  module.initBallPosition = initBallPosition;
  module.makeShellsClickable = makeShellsClickable;
  module.unassignShellClickHandlers = unassignShellClickHandlers;
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

  guesswasrightAction: function () {
    console.log("guesswasright");
    $(INSTRUCTIONS_CONTAINER_SELECTOR).empty().append(APP.TRANSLATIONS.en.instructions.guesswasright);
    $('.ball-container').fadeOut(1000, transitionToNextState);
    $(ACTION_BUTTON_SELECTOR).show();
    APP.UI.unassignShellClickHandlers();
  },

  playagainAction: function () {
    console.log("playagain");
  }
};
;

var APP = APP || {};

APP.STATE_MACHINE = (function () {

  // 'constants'
  var STATES = ['WELCOME', 'SHOWBALL', 'HIDEBALL', 'SHUFFLE', 'GUESS', 'GUESSWASWRONG', 'GUESSWASRIGHT', 'PLAYAGAIN'];

  var currentState;

  var init = function () {
    currentState = STATES[0];
    callStateAction(currentState);
  }

  function transitionToNextState () {
    var newState;
    if (currentState == STATES[STATES.length - 1]) {
      newState = STATES[1];
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
  }
	
  var module = {};
  module.init = init;
  module.actionButtonClickHandler = actionButtonClickHandler;
  return module;
})();
;

var APP = APP || {};

APP.TRANSLATIONS = {
  "en": {
    "instructions": {
      "welcome": "Welcome to the Game of Shells!",
      "showball": "Do you see the red ball? Pay attention where it's hidden!",
      "shuffle": "Shuffling...",
      "guess": "Can you guess where the ball is?",
      "guesswaswrong": "No, that's not where the ball is...",
      "guesswasright": "That's right, the ball is here!"
    },
    "buttonlabels": {
      "welcome": "Start the game!",
      "showball": "Got it, now shuffle!"
    }
  }
};
