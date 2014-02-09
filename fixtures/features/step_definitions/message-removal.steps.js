var assert = require('assert');

module.exports = function() {
  'use strict';

  this.When(/^I click the remove\-message button$/, function(callback) {
    this.dispatchClickEvent(this.query('#remove-message-button'));
    callback();
  });

  this.Then(/^I am no longer shown a 'hello, world' message$/, function(callback) {
    assert.equal(this.query('#message-field').textContent, '', 'Message should be cleared.');
    callback();
  });

};