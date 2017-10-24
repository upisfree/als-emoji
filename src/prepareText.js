module.exports = function(text) {
  var specialSymbols = /(@|&|'|\(|\)|<|>|#)/g;

  return text.replace(specialSymbols, '').toLowerCase();
}