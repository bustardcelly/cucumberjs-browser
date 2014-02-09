var fs = require('fs');
var glob = require('glob');
var browserify = require('browserify');

require('colors');

var FEATURES_GLOBAL = 'cukefeatures';

var bundle = function bundle(file, outfile) {
  return browserify(file)
          .bundle({
            standalone: FEATURES_GLOBAL
          })
          .pipe(fs.createWriteStream(outfile));
};

module.exports = function featurify(featureDir, tempdir, outdir, cb) {
  
  var features = [];
  var featuresStr = '';
  var lineAppend = '+';
  var crgToken = '&crarr';
  var tmpfile = [tempdir, 'features.js'].join('/');
  var outfile = [outdir, 'features.js'].join('/');

  glob([featureDir, '*.feature'].join('/'), function(error, files) {
  
    if(error) {
      console.log(('Error in bundling features: ' + error).red);
      cb(error);
    }
    else {
      var fileIndex = 0;
      var fileLength = files.length;
      files.forEach(function(filepath) {
        var lines = fs.readFileSync(filepath, 'utf8').split('\n');
        var index = 0;
        lines.forEach(function(line) {
          lines[index] = ['"', line, crgToken, '"', (index === lines.length - 1) ? '' : lineAppend].join('');
          index++;
        });
        lines[lines.length-1] += (++fileIndex === fileLength) ? '' : [lineAppend, '"', crgToken, '"', lineAppend].join('');
        features = features.concat(lines);
      });

      featuresStr = features.join('\n');
      fs.writeFile(tmpfile, 'module.exports = ' + featuresStr + ';', 'utf8', function(error) {
        if(error) {
          console.log(('Error in writing to file ' + tmpfile + '.').red);
          cb(error);
        }
        else {
          bundle(tmpfile, outfile).on('close', function() {
            cb(error);
          });
        }
      });
    }

  });

};