var fs = require('fs');
var path = require('path');
var assert = require('assert');

module.exports = function() {
  'use strict';

  var formatType;

  this.World = require('../support/world').World;

  this.Given(/^I invoke the tool with format option '(.*)'$/, function(type, callback) {
    formatType = type;
    this.runCli(['-f', type], callback);
  });

  this.Then(/^The target format listener lib is placed in the 'script' directory$/, function(callback) {
    var filepath = path.resolve(this.outdir, 'script', formatType + '-listener.js');
    assert.equal(fs.existsSync(filepath), true,
      'Listener library not regenerated at expected location: ' + filepath + '.');
    callback();
  });

  this.Then(/^The listener is accessible on the window with global name 'cukelistener'$/, function(callback) {
    this.visit(function(error, window) {
      if(error) {
        assert.equal(true, false, 'Browser failed: ' + error);
      }
      else {
        assert.equal('cukelistener' in window, true,
          'Access to listener library should be set as global name \'cukelistener\' on the window object.');
      }
    }, callback);
  });

  this.Then(/^Invokable using instance\(\)$/, function(callback) {
    this.visit(function(error, window) {
      if(error) {
        assert.equal(true, false, 'Browser failed: ' + error);
      }
      else {
        assert.notEqual(window.cukelistener.instance(), undefined,
          'Access to listener instance should be through instance() method.');
      }
    }, callback);
  });

  this.After(function(callback) {
    this.cleanOut(callback);
  });

};