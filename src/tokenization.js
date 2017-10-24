var Az = require('./az');

module.exports = function(text) {
  return Az.Tokens(text).done();
}