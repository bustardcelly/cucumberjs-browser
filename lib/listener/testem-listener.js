/*global window*/
'use strict';
var emit = window.Testem.emit;
var currentTest;
var currentStep;
var id = 0;
var results = {
  failed: 0,
  passed: 0,
  total: 0,
  tests: [],
  runDuration: 0
};
var start = -1;

var listener = {
  complete: function() {
    results.runtime = new Date().getTime() - start;
    emit('all-test-results', results);
  },
  hear: function(event, callback) {
    var eventName = event.getName();
    if(start === -1) {
      start = new Date().getTime();
    }
    switch (eventName) {

      default:
        callback();
        break;

      case 'BeforeStep':
        currentStep = event.getPayloadItem('step');
        currentTest = {
            id: id++,
            name: currentStep.getName(),
            items: []
        };
        callback();
        break;
        
      case 'StepResult':
        var stepResult = event.getPayloadItem('stepResult');
        var result = {
            passed: true,
            line: currentStep.getLine(),
            message: currentStep.getName()
        };
        if(stepResult.isSuccessful()) {
          currentTest.items.push(result);
        }
        else if(stepResult.isPending()) {
          currentTest.items.push(result);
        }
        else if(stepResult.isUndefined() || stepResult.isSkipped()) {
          currentTest.items.push(result);
        } 
        else {
          var error = stepResult.getFailureException();
          var errorMessage = error.stack || error;
          currentTest.items.push({
            passed: false,
            line: currentStep.getLine(),
            stack: error.stack,
            message: errorMessage
          });
        }
        currentTest.failed = !stepResult.isSuccessful();
        currentTest.passed = stepResult.isSuccessful();
        results.total += 1;
        if(currentTest.failed) {
          results.failed += 1;
        }
        else {
          results.passed += 1;
        }
        results.tests.push(currentTest);
        emit('test-result', currentTest);
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