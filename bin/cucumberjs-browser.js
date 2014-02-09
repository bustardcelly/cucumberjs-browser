#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var when = require('when');
var parseArgs = require('minimist');
var args = parseArgs(process.argv.slice(2));

var tempdir = path.resolve(process.cwd(), '../.tmp');
var format = args.f;
var outdir = args.o || process.cwd() + '/browser-cukes';
var tmplPath = args.tmpl || path.resolve(__dirname, '../template/cucumber-testrunner.template');
var featuresPath = args.features || process.cwd() + '/features';
//TODO: -r steps -t tags

var htmlTemplate = require('../lib/tmpl');
var listenerify = require('../lib/listenerify');
var featurify = require('../lib/featurify');
var stepify = require('../lib/stepify');

var pkg = require(path.resolve(__dirname, '../package.json'));
var msgPrepend = '[cucumberjs-browser ' + pkg.version + ']';

require('colors');

var tmplModel = {
  steps: [],
  modules: [],
  listener: {
    exists: false,
    filename: ''
  }
};

var cleandir = function cleandir(dir, callback) {
  fs.exists(dir, function(exists) {
    if(exists) {
      rimraf(dir, callback);
    }
    else {
      callback();
    }
  });
};

var createdir = function createdir(dir) {
  var dfd = when.defer();
  cleandir(dir, function(error) {
    if(error) {
      console.log(('Error in clean of ' + dir + ': ' + error).red);
    }
    mkdirp(dir, function() {
      dfd.resolve();
    });
  });
  return dfd.promise;
};

var bundleFeatures = function bundleFeatures() {
  var dfd = when.defer();
  featurify(featuresPath, tempdir, outdir, function(error) {
    rimraf(tempdir, function(err) {
      if(err || error) {
        dfd.reject(err || error);
      }
      else {
        console.log((msgPrepend + ' Features bundled successfully.').cyan);
        dfd.resolve(tmplModel);
      }
    });
  });
  return dfd.promise;
};

var bundleSteps = function bundleSteps(tmplData) {
  var dfd = when.defer();
  stepify(featuresPath, outdir, tmplData, function(error) {
    if(error) {
      dfd.reject(error);
    }
    else {
      console.log((msgPrepend + ' Steps bundled successfully.').cyan);
      dfd.resolve(tmplData);
    }
  });
  return dfd.promise;
};

var bundleListener = function bundleListener(tmplData) {
  var dfd = when.defer();
  listenerify(format, outdir, tmplData, function(error) {
    if(error) {
      dfd.reject(error);
    }
    else {
      console.log((msgPrepend + ' Listener bundled successfully.').cyan);
      dfd.resolve(tmplData);
    }
  });
  return dfd.promise;
};

var generateTemplate = function generateTemplate(tmplData) {
  var dfd = when.defer();
  var outfile = [outdir, 'cucumber-testrunner.html'].join('/');
  fs.writeFile(outfile, htmlTemplate(tmplPath, tmplData), 'utf8', function(error) {
    if(error) {
      dfd.reject(error);
    }
    else {
      console.log((msgPrepend + ' Template generated successfully.').cyan);
      dfd.resolve(tmplData);
    }
  });
  return dfd.promise;
};

var copyCucumberLib = function copyCucumberLib(tmplData) {
  var dfd = when.defer();
  mkdirp.sync(outdir + '/lib');
  fs.createReadStream(path.resolve(__dirname, '../node_modules/cucumber/release/cucumber.js'))
    .pipe(fs.createWriteStream(path.resolve(outdir, 'lib/cucumber.js')))
    .on('close', function(error) {
      if(error) {
        dfd.reject(error);
      }
      else {
        console.log((msgPrepend + ' CucumberJS library transferred successfully.').cyan);
        dfd.resolve(tmplData);
      }
    });
  return dfd.promise;
};

var start = new Date().getTime();
console.log((msgPrepend + ' Started...').white);
createdir(tempdir)
  .then(function() {
    return createdir(outdir);
  })
  .then(bundleFeatures)
  .then(bundleSteps)
  .then(bundleListener)
  .then(generateTemplate)
  .then(copyCucumberLib)
  .then(function() {
    var elapsed = ((new Date().getTime() - start)/60).toFixed(2);
    console.log((msgPrepend + ' Completed: ' + elapsed.toString() + ' seconds.').white);
  })
  .catch(function(error) {
    console.log((msgPrepend + ' Error in generating browser-based cukes: ' + error).red);
  });