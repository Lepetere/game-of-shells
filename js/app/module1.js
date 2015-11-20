var APP = APP || {};

APP.module1 = (function () {

  var init = function () {
  	$('.instruction-text').append("Welcome to the Game of Shells!");
  };
	
  var function1 = function () {
    // example...
  };
	
  var module = {};
  module.function1 = function1;
  module.init = init;
  return module;
})();