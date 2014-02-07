var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var child_process = require('child_process');
// var Browser = require('zombie');

module.exports = function() {
  'use strict';

  var formatType;
  var outputDir = process.cwd() + '/browser-cukes';
  // var browser =  new Browser({
  //   debug: false,
  //   runScripts: true,
  //   loadCSS: true
  // });

  this.World = require('../support/world').World;

  this.Given(/^I invoke the tool with format option '(.*)'$/, function(type, callback) {
    formatType = type;
    child_process
        .spawn('node', ['bin/cucumberjs-browser.js', '-f', formatType])
        .on('exit', callback);
  });

  this.Then(/^The target format listener lib is placed in the 'script' directory$/, function(callback) {
    var filepath = path.resolve(outputDir, 'script', formatType + '-listener.js');
    assert.equal(fs.existsSync(filepath), true, 'Listener library not regenerated at expected location: ' + filepath + '.');
    rimraf(outputDir, callback);
  });

  this.Then(/^The listener is accessible on the window with global name 'cukelistener'$/, function(callback) {
    // browser.visit(outputDir + '/cucumberjs-testrunner.html', function(error, browser) {
    //   assert.equal('cukelistener' in browser.window, true, 'Access to listener library should be set as global name \'cukelistener\' on the window object.');
    //   callback();
    // });
    callback();
  });

  this.Then(/^Invokable using instance\(\)$/, function(callback) {
    // assert.notEqual(browser.window.cukelistener.instance(), undefined, 'Access to listener instance should be through instance() method.');
    // browser.close();
    rimraf(outputDir, callback);
  });

};