var fs = require('fs');
var path = require('path');
var S = require('string');
var glob = require('glob');
var browserify = require('browserify');

require('colors');

var bundle = function bundle(filepath, outdir) {
  var name = S(path.basename(filepath, '.js').split('.').join('-')).camelize().s;
  var output = [outdir, name].join('/') + '.js';
  browserify(filepath)
    .bundle({
      standalone: name
    })
    .pipe(fs.createWriteStream(path.resolve(output)));
  return {filepath:path.basename(output), name:name};
};

module.exports = function stepify(featureDir, outdir, tmplData, callback) {

  var modules = [], steps = [];

  glob(featureDir + '/+(support|step_definitions)/**/*.js', function(error, files) {
    
    var module;
    if(error) {
      console.log(('Error in bundling steps: ' + error).red);
    }
    else {
      files.forEach(function(filepath) {
        module = bundle(filepath, outdir);
        if(/world.js/i.test(filepath)) {
          modules.unshift(module);
        }
        else {
          modules.push(module);
          steps.push(module);
        }
      });
    }
    tmplData.modules = tmplData.modules.concat(modules);
    tmplData.steps = tmplData.steps.concat(steps);
    callback(error, tmplData);
  });

};