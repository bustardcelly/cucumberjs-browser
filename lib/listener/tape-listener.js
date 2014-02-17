var tape = require('tape');
var test;
var currentStep;

var listener = {
  complete: function() {
    if(test) {
      test.end();
    }
  },
  hear: function(event, callback) {
    var eventName = event.getName();
    switch (eventName) {

      default:
        callback();
        break;

      case 'BeforeFeature':
        var feature = event.getPayloadItem('feature');
        callback();
        break;

      case 'AfterFeature':
        callback();
        break;

      case 'BeforeScenario':
        var scenario = event.getPayloadItem('scenario');
        if(test) {
          test.test(scenario.getName(), function(t) {
            test = t;
            callback();
          });
        }
        else {
          tape(scenario.getName(), function(t) {
            test = t;
            callback();
          });
        }
        break;

      case 'BeforeStep':
        var step = event.getPayloadItem('step');
        currentStep = step;
        callback();
        break;
        
      case 'StepResult':
        var stepResult = event.getPayloadItem('stepResult');
        if (stepResult.isSuccessful()) {
          test.pass(currentStep.getName());
        }
        else if (stepResult.isPending()) {
          test.skip(currentStep.getName());
        }
        else if (stepResult.isUndefined() || stepResult.isSkipped()) {
          test.skip(currentStep.getName());
        }
        else {
          var error = stepResult.getFailureException();
          var errorMessage = error.stack || error;
          test.fail(errorMessage);
        }
        callback();
        break;

    }
  }
};

module.exports = {
  instance: function() {
    return listener;
  }
};