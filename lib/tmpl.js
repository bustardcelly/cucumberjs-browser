var _ = require('lodash');
var fs = require('fs');
require('colors');

module.exports = function(templatePath, data) {
  var content = fs.readFileSync(templatePath, 'utf8');
  return _.template(content)(data);
};