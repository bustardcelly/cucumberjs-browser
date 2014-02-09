'use strict';
var path = require('path');
var rimraf = require('rimraf');
var child_process = require('child_process');

var http = require('http');
var connect = require('connect');
var Browser = require('zombie');
var port = 8081;

var outputdir = process.cwd() + '/browser-cukes';

var World = function World(callback) {

  callback();

  this.outdir = outputdir;
  this.browser = new Browser();

  (function(world) {
    world.visit = function(assertion, callback) {
      var url = 'http://localhost:' + port + '/cucumber-testrunner.html';
      var app = connect().use(connect.static(outputdir));
      var server = http.createServer(app).listen(port, function() {
        world.browser.visit(url, function(error, browser) {
          assertion.call(world, error, world.browser.window);
          server.unref();
          server.close(function() {
            callback();
            world.browser.close();
          });
        });
      });
    };
  }(this));

  this.runCli = function(options, callback) {
    var cli = child_process
                .spawn('node', ['bin/cucumberjs-browser.js', 
                                '--features', path.resolve(__dirname, '../../fixtures/features'),
                                '--tmpl', path.resolve(__dirname, '../../fixtures/template/index.html'),
                                ].concat(options))
                .on('exit', function() {
                  cli.kill();
                  callback();
                });
  };

  this.cleanOut = function(callback) {
    rimraf(this.outdir, callback);
  };

};

module.exports.World = World;