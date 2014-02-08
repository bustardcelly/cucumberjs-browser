'use strict';

var World = function(callback) {
  this.window = window;

  this.route = function(uri) {
    // stubbed.
  };

  callback();
}
module.exports.World = World;