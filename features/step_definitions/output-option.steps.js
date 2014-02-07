var fs = require('fs');
var path = require('path');
var assert = require('assert');
var rimraf = require('rimraf');
var child_process = require('child_process');

module.exports = function() {
  'use strict';

  var outputdir;

  this.Given(/^I invoke the tool with output option '(.*)'$/, function(dir, callback) {
    outputdir = dir;
    child_process
        .spawn('node', ['bin/cucumberjs-browser.js', '-o', outputdir])
        .on('exit', callback);
  });

  this.When(/^The tool is finished$/, function(callback) {
    // passed by reaching here from previous Given callback.
    callback();
  });

  this.Then(/^The target directory is accessible at the provided location$/, function(callback) {
    assert.equal(fs.existsSync(outputdir), true, 'Output directory not generated properly: ' + outputdir + '.');
    rimraf(outputdir, callback);
  });

  this.Then(/^The directory '(.*)' is not accessible$/, function(tmpdir, callback) {
    assert.equal(fs.existsSync(tmpdir), false, 'Temp directory created for generation is not removed: ' + tmpdir + '.');
    callback();
  });

};