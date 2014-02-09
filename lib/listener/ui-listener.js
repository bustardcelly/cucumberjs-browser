'use strict';
var currentStep;

var listener = {
  complete: function() {
    //
  },
  hear: function(event, callback) {
    var eventName = event.getName();
    switch (eventName) {

      default:
        //
        break;

      case 'BeforeFeature':
        var feature = event.getPayloadItem('feature');
        console.log(JSON.stringify({
          keyword     : feature.getKeyword(),
          name        : feature.getName(),
          line        : feature.getLine(),
          description : feature.getDescription()
        }, null, 2));
        break;

      case 'BeforeScenario':
        var scenario = event.getPayloadItem('scenario');
        console.log(JSON.stringify({
          keyword     : scenario.getKeyword(),
          name        : scenario.getName(),
          line        : scenario.getLine(),
          description : scenario.getDescription()
        }, null, 2));
        break;

      case 'BeforeStep':
        var step = event.getPayloadItem('step');
        currentStep = step;
        console.log(JSON.stringify({
          keyword: step.getKeyword(),
          name   : step.getName(),
          line   : step.getLine(),
        }, null, 2));
        break;
        
      case 'StepResult':
        var result;
        var stepResult = event.getPayloadItem('stepResult');
        if (stepResult.isSuccessful()) {
          result = {passed:true};
        } else if (stepResult.isPending()) {
          result = {passed:true, message: 'pending'};
        } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
          result = {passed:true, message:'skipped'};
        } else {
          var error = stepResult.getFailureException();
          var errorMessage = error.stack || error;
          result = {passed:false, message: errorMessage};
        }
        console.log(JSON.stringify(result, null, 2));
        break;
        
    }
    callback();
  }
};

module.exports = {
  instance: function() {
    return listener;
  }
};