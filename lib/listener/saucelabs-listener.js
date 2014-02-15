/*global window*/
// Modelled after QUnit suacelabs runner.
var results = {
  total: 0,
  failed: 0,
  passed: 0,
  runtime: 0
};
var start = -1;

var listener = {
  complete: function() {
    results.runtime = new Date().getTime() - start;
    window.global_test_results = results;
    console.log(JSON.stringify(window.global_test_results, null, 2));
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
        
      case 'StepResult':
        var stepResult = event.getPayloadItem('stepResult');
        results.passed += (stepResult.isSuccessful()) ? 1 : 0;
        results.failed += (stepResult.isSuccessful()) ? 0 : 1;
        results.total = results.total + 1;
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