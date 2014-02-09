var fs = require('fs');
var assert = require('assert');

module.exports = function() {
  'use strict';

  this.Given(/^I invoke the tool with output option '(.*)'$/, function(dir, callback) {
    this.outdir = dir;
    this.runCli(['-o', this.outdir], callback);
  });

  this.When(/^The tool is finished$/, function(callback) {
    // passed by reaching here from previous Given callback.
    callback();
  });

  this.Then(/^The target directory is accessible at the provided location$/, function(callback) {
    assert.equal(fs.existsSync(this.outdir), true,
      'Output directory not generated properly: ' + this.outdir + '.');
    callback();
  });

  this.Then(/^The directory '(.*)' is not accessible$/, function(tmpdir, callback) {
    assert.equal(fs.existsSync(tmpdir), false,
      'Temp directory created for generation is not removed: ' + tmpdir + '.');
    callback();
  });

  this.After(function(callback) {
    this.cleanOut(callback);
  });

};