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
  return module;
})();
