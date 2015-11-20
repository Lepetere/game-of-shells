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
