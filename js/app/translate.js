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
