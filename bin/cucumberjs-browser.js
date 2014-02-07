#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var parseArgs = require('minimist');
var args = parseArgs(process.argv.slice(2));

var tmplModel = {
  steps: [],
  modules: [],
  listener: {
    exists: false,
    filename: ''
  }
};

var tempdir = path.resolve(__dirname, '../.tmp');
// -o output-dir, -tmpl template, -f features, -f format
var format = args.f;
var outdir = args.o || process.cwd() + '/browser-cukes';
var tmplPath = args.tmpl || path.resolve(__dirname, '../template/cucumber-testrunner.template');
var featuresPath = args.features || process.cwd() + '/features';
// -r steps -t tags

var htmlTemplate = require('../lib/tmpl');
var listenerify = require('../lib/listenerify');
var featurify = require('../lib/featurify');
var stepify = require('../lib/stepify');

require('colors');

var cleandir = function cleandir(dir, callback) {
  fs.exists(dir, function(exists) {
    if(exists) {
      console.log(('rm -rf ' + dir + '...').white);
      rimraf(dir, callback);
    }
    else {
      callback();
    }
  });
};

var createdir = function createdir(dir, callback) {
  cleandir(dir, function(error) {
    if(error) {
      console.log(('Error in clean of ' + dir + ': ' + error).red);
    }
    console.log(('mkdir ' + dir + '...').white);
    mkdirp(dir, callback);
  });
};

var bundleFeatures = function bundleFeatures(callback) {
  featurify(featuresPath, tempdir, outdir, function(error) {
    rimraf(tempdir, function(error) {
      if(error) {
        throw new Error(error);
      }
      callback();
    });
  });
};

var bundleSteps = function bundleSteps(tmplData, callback) {
  stepify(featuresPath, outdir, tmplData, callback);
};

var bundleListener = function bundleListener(tmplData, callback) {
  listenerify(format, outdir, tmplData, callback);
};

var generateTemplate = function generateTemplate(tmplData, callback) {
  var outfile = [outdir, 'cucumber-testrunner.html'].join('/');
  fs.writeFile(outfile, htmlTemplate(tmplPath, tmplData), 'utf8', function(error) {
    callback(error);  
  });
};

var copyCucumberLib = function copyCucumberLib(callback) {
  mkdirp.sync(outdir + '/lib');
  fs.createReadStream(path.resolve(__dirname, '../node_modules/cucumber/release/cucumber.js'))
    .pipe(fs.createWriteStream(path.resolve(outdir, 'lib/cucumber.js')));
};

createdir(tempdir, function(error) {
  if(error) {
    throw new Error(error);
  }
  createdir(outdir, function(error) {
    if(error) {
      throw new Error(error);
    }
    bundleFeatures(function(error) {
      bundleSteps(tmplModel, function(error, tmplData) {
        bundleListener(tmplData, function(error, tmplData) {
          generateTemplate(tmplData, function(error) {
            copyCucumberLib();  
          });
        });
      });
    });
  });
});



