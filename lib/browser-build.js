#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var S = require('string');
var _ = require('lodash');
var glob = require('glob');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var browserify = require('browserify');

var resolveCwdPath = function resolveCwdPath() {
  return [process.cwd()].concat(Array.prototype.slice.call(arguments)).join(path.sep);
};

var generateTestRunnerTemplate = function generateTestRunnerTemplate(path) {
  var f = fs.readFileSync(path, 'utf8');
  return _.template(f);
};

var tempdir = resolveCwdPath('.tmp');
var outdir = resolveCwdPath('browser-cukes');
var tplPath = resolveCwdPath('cucumber-testrunner.template');
var testRunnerTemplate = generateTestRunnerTemplate(tplPath);

mkdirp.sync(tempdir);
mkdirp.sync(outdir);

var standalone = function standalone(filepath) {
  var name = S(path.basename(filepath, '.js').split('.').join('-')).camelize().s;
  var output = [outdir, name].join(path.sep) + '.js';
  browserify([process.cwd(), filepath].join(path.sep))
    .bundle({
      standalone: name
    })
    .pipe(fs.createWriteStream(path.resolve(output)));
  return {filepath:path.basename(output), name:name};
};

// Features module.
glob('features/*.feature', function(error, files) {
  var features = [];
  var featuresStr = '';
  var lineAppend = '+';

  files.forEach(function(filepath) {
    var lines = fs.readFileSync(filepath, 'utf8').split('\n');
    var index = 0;
    lines.forEach(function(line) {
      lines[index++] = '"' + line + '&crarr"' + lineAppend;
    });
    features = features.concat(lines);
  });

  featuresStr = features.join('\n');
  fs.writeFileSync([tempdir, 'features.js'].join(path.sep), 'module.exports = ' + featuresStr.substring(0, featuresStr.length-lineAppend.length) + ';');

  // Can't do standalone on stream or buffer :(
  browserify([tempdir, 'features.js'].join(path.sep))
    .bundle({
      standalone: 'cukefeatures'
    })
    .pipe(fs.createWriteStream([outdir, 'features.js'].join(path.sep)))
    .on('close', function() {
      rimraf(tempdir, function(err) {
        if(err) {
          throw new Error(err);
        }
      });
    });

});

// Support/Steps module
glob('features/+(support|step_definitions)/**/*.js', function(error, files) {
  var modules = [],
      steps = [],
      step_code = [];

  var module;

  files.forEach(function(filepath) {

    module = standalone(filepath);

    if(/world.js/i.test(filepath)) {
      modules.unshift(module);
    }
    else {
      modules.push(module);
      // > Either 
      steps.push(module);
      // > Or
      // var code = 'var module = ' + require(path.resolve(filepath)).toString();
      // var ast = Uglify.parse(code);
      // // ast.walk(new Uglify.TreeWalker(function(node){
      // //   if(node instanceof Uglify.AST_FUNCTION) {
      // //     console.log(node);
      // //   }
      // // }));
      // var funcbody = ast.body[0].definitions[0].value.body;
      // var step = code.substring(funcbody[0].start.pos, funcbody[funcbody.length-1].end.endpos);
      // step_code.push(step);
    }
  });
  fs.writeFileSync([outdir, 'cucumber-testrunner.html'].join(path.sep), testRunnerTemplate({modules:modules, steps:steps, step_code:step_code}), 'utf8');
});

browserify([process.cwd(), 'tape-listener.js'].join(path.sep))
    .bundle({
      standalone: 'cuketap'
    })
    .pipe(fs.createWriteStream([outdir, 'tap-listener.js'].join(path.sep)));

// var server = require('karma').server;
// server.start({port: 9876}, function(exitCode) {
//   console.log('Karma has exited with ' + exitCode);
//   process.exit(exitCode);
// });