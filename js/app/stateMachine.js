var APP = APP || {};

APP.STATE_MACHINE = (function () {

  // 'constants'
  var STATES = ['WELCOME', 'SHOWBALL', 'SHUFFLE', 'GUESS', 'GUESSWASWRONG', 'GUESSWASRIGHT', 'PLAYAGAIN'];

  var currentState;

  var init = function () {
    currentState = STATES[0];
    callStateAction(currentState);
  }

  function transitionToNextState () {
    var newState;
    if (currentState == STATES[STATES.length - 1]) {
      newState = STATES[0];
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
      APP.STATE_ACTIONS[state.toLowerCase() + "Action"]();
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
