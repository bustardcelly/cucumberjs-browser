/*global window*/
'use strict';
var page;
var container;
var currentFeature;
var currentScenario;
var currentStep;

var addFeatureToContainer = function(name) {
  var feature = window.document.createElement('div');
  var text = window.document.createTextNode(name);
  feature.appendChild(text);
  feature.classList.add('cuke-feature');
  container.appendChild(feature);
  return feature;
};

var addScenarioToFeature = function(name, feature) {
  var scenario = window.document.createElement('div');
  var text = window.document.createTextNode(name);
  scenario.appendChild(text);
  scenario.classList.add('cuke-scenario');
  feature.appendChild(scenario);
  return scenario;
};

var addStepToScenario = function(name, scenario) {
  var step = window.document.createElement('p');
  var text = window.document.createTextNode(name);
  step.appendChild(text);
  step.classList.add('cuke-step');
  scenario.appendChild(step);
  return step;
};

var addFailureToStep = function(description, step) {
  var failure = window.document.createElement('div');
  var text = window.document.createTextNode(description);
  failure.appendChild(text);
  failure.classList.add('cuke-fail-description');
  step.appendChild(failure);
  return failure;
};

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
        // console.log(JSON.stringify({
        //   keyword     : feature.getKeyword(),
        //   name        : feature.getName(),
        //   line        : feature.getLine(),
        //   description : feature.getDescription()
        // }, null, 2));
        currentFeature = addFeatureToContainer(feature.getKeyword() + ': ' + feature.getName());
        break;

      case 'BeforeScenario':
        var scenario = event.getPayloadItem('scenario');
        // console.log(JSON.stringify({
        //   keyword     : scenario.getKeyword(),
        //   name        : scenario.getName(),
        //   line        : scenario.getLine(),
        //   description : scenario.getDescription()
        // }, null, 2));
        currentScenario = addScenarioToFeature(scenario.getKeyword() + ': ' + scenario.getName(), currentFeature);
        break;

      case 'BeforeStep':
        var step = event.getPayloadItem('step');
        // console.log(JSON.stringify({
        //   keyword: step.getKeyword(),
        //   name   : step.getName(),
        //   line   : step.getLine(),
        // }, null, 2));
        currentStep = addStepToScenario(step.getKeyword() + ': ' + step.getName(), currentScenario);
        break;
        
      case 'StepResult':
        var result;
        var resultClass = 'cuke-step-fail';
        var stepResult = event.getPayloadItem('stepResult');
        if (stepResult.isSuccessful()) {
          result = {passed:true};
          resultClass = 'cuke-step-pass';
        }
        else if (stepResult.isPending()) {
          result = {passed:true, message: 'pending'};
          resultClass = 'cuke-step-pending';
        }
        else if (stepResult.isUndefined() || stepResult.isSkipped()) {
          result = {passed:true, message:'skipped'};
          resultClass = 'cuke-step-skipped';
        }
        else {
          var error = stepResult.getFailureException();
          var errorMessage = error.stack || error;
          result = {passed:false, message: errorMessage};
          addFailureToStep(errorMessage, currentStep);
        }
        // console.log(JSON.stringify(result, null, 2));
        currentStep.classList.add(resultClass);
        break;
        
    }
    callback();
  }
};

module.exports = {
  instance: function() {
    page = window.document.body;
    if(typeof container === 'undefined') {
      container = window.document.createElement('div');
      container.classList.add('cukes-container');
      page.appendChild(container);
    }
    return listener;
  }
};