'use strict';
var tape = require('tape');
var test;
var currentStep;
var customSocket;
var results = {
  passed: 0,
  failed: 0,
  tests: []
};
var listener = {
  hear: function(event, callback) {
    var eventName = event.getName();
    switch (eventName) {
      default:
        // console.log(eventName);
        callback();
        break;

      case 'BeforeFeature':
        var feature = event.getPayloadItem('feature');
        // console.log(JSON.stringify({
        //   keyword     : feature.getKeyword(),
        //   name        : feature.getName(),
        //   line        : feature.getLine(),
        //   description : feature.getDescription()
        // }, null, 2));

        if(test) {
          test.complete();
        }
        callback();
        break;

      case 'BeforeScenario':
        var scenario = event.getPayloadItem('scenario');
        // console.log(JSON.stringify({
        //   keyword     : scenario.getKeyword(),
        //   name        : scenario.getName(),
        //   line        : scenario.getLine(),
        //   description : scenario.getDescription()
        // }, null, 2));

        tape(scenario.getName(), function(t) {
          test = t;
          if(customSocket) {
            results.tests.length = 0;
            results.passed = results.failed = 0;
            customSocket.emit("tests-start");
          }
          callback();
        });
        break;

      case 'AfterScenario':
        if(customSocket) {
          customSocket.emit("all-test-results", results);
        }
        break;

      case 'BeforeStep':
        var step = event.getPayloadItem('step');
        currentStep = step;
        // console.log(JSON.stringify({
        //   keyword: step.getKeyword(),
        //   name   : step.getName(),
        //   line   : step.getLine(),
        // }, null, 2));
        callback();
        break;
        
      case 'StepResult':
        var result;
        var stepResult = event.getPayloadItem('stepResult');
        if (stepResult.isSuccessful()) {
          result = {passed:true};

          test.pass(currentStep.getName());
        } else if (stepResult.isPending()) {
          result = {passed:true, message: 'pending'};
          test.skip(currentStep.getName());
        } else if (stepResult.isUndefined() || stepResult.isSkipped()) {
          result = {passed:true, message:'skipped'};
          test.skip(currentStep.getName());
        } else {
          var error = stepResult.getFailureException();
          var errorMessage = error.stack || error;
          result = {passed:false, message: errorMessage};
          test.fail(errorMessage);
        }
        if(customSocket) {
          customSocket.emit("test-result", result)
        }
        results.passed += result.passed ? 1 : 0;
        results.failed += !result.passed ? 1 : 0;
        results.tests.push(result);
        // console.log(JSON.stringify(result, null, 2));
        callback();
        break;
    }
  }
};

module.exports = {
  instance: function(socket) {
    customSocket = socket;
    return listener;
  }
};