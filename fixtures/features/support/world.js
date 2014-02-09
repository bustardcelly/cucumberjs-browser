/*global window*/
'use strict';

var World = function(callback) {
  this.window = window;

  this.route = function(uri) {
    // stubbed.
  };

  this.query = function(selector) {
    return this.window.document.querySelector(selector);
  };

  this.dispatchClickEvent = function(element) {
    var event = this.window.document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    element.dispatchEvent(event);
  };

  callback();
};

module.exports.World = World;