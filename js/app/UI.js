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
  }

  // adds 3 shell containers at random grid positions and saves the positions
  initShellPositions = function () {
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
        var wasRightGuess = ballPosition
        APP.STATE_MACHINE.shellContainerClickHandler(ballPositionIndex == index);
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
      ballPositionIndex = Math.floor(Math.random() * 3);
      ballPosition = shellPositions[ballPositionIndex];
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
  module.resetGame = resetGame;
  module.initShellPositions = initShellPositions;
  return module;
})();
