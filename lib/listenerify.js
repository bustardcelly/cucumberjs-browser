var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var browserify = require('browserify');

var listenerDir = path.resolve(__dirname, 'listener');

var Formats = {
  'ui': listenerDir + '/ui-listener.js',
  'tap': listenerDir + '/tape-listener.js',
  'saucelabs': listenerDir + '/saucelabs-listener.js',
  'testem': listenerDir + '/testem-listener.js'
};

var exists = function(format) {
  return Formats.hasOwnProperty(format);
};

module.exports = function(format, outdir, tmplData, callback) {
  var filename, filepath;
  if(format && exists(format.toLowerCase())) {
    format = format.toLowerCase();
    mkdirp.sync([outdir, 'script'].join('/'));
    filename = format + '-listener.js';
    filepath = [outdir, 'script', filename].join('/');
    tmplData.listener.exists = true;
    tmplData.listener.filename = filename;
    browserify(Formats[format])
      .bundle({
        standalone: 'cukelistener'
      })
      .pipe(fs.createWriteStream(filepath));
    tmplData.listener.format = format;
    callback(null, tmplData);
  }
  else {
    callback(null, tmplData);
  }
};