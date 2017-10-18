// поддержка пока что только русского и английского из-за начальной формы
var Az = require('./az'),
    specialSymbols = /(\s+|@|&|'|\(|\)|<|>|#)/g;

window.update = function() {
  var tokens = Az.Tokens(input.value).done();

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === Az.Tokens.WORD && tokens[i].subType === Az.Tokens.CYRIL) {
      let word = Az.Morph(tokens[i].toString().replace(specialSymbols, ''), {
        ignoreCase: true,
        stutter: false
      })[0].normalize().word;

      let xpathResult = document.evaluate("//annotation[text() = '" + word + "']", window.emojiData, null, XPathResult.ANY_TYPE, null);
      let node = xpathResult.iterateNext()
      // let xpathResult = document.evaluate("//annotation[starts-with(text(), '" + text[i] + "')]", window.emojiData, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      // var xpathResult = document.evaluate("//annotation[contains(text(), '" + text[i] + "')]", window.emojiData, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);

      if (node) {
        tokens[i] = node.getAttribute('cp');
      }

      // try {
      //   var node = xpathResult.iterateNext();

      //   // if (node)
      //   //   word = '';

      //   while (node) {
      //     word += node.getAttribute('cp') + ' ';
      //     node = xpathResult.iterateNext();
      //   } 
      // }
      // catch (e) {
      //   console.log('Error: Document tree modified during iteration ' + e);
      // }
    }
  }

  output.textContent = tokens.join(' ');
}

var input = document.getElementById('input');
var output = document.getElementById('output');

var xhr = new XMLHttpRequest();

xhr.open('GET', 'ru.xml', true);
xhr.responseType = 'document';
xhr.onreadystatechange = function() {
  if (xhr.readyState != 4)
    return;

  window.emojiData = xhr.responseXML;
};

// init
Az.Morph.init('node_modules/az/dicts', function() {
  xhr.send();
});