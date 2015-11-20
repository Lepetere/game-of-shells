$(document).ready(function () {
  APP.module1.init();
});;

var APP = APP || {};

APP.module1 = (function () {

  var init = function () {
  	$('body').append("<p>I'm some Javascript!</p>");
  };
	
  var function1 = function () {
    // example...
  };
	
  var module = {};
  module.function1 = function1;
  module.init = init;
  return module;
})();