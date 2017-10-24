module.exports = function(word, lang, emojies) {
  let variants = [];

  for (let a in emojies) {
    if (emojies[a][lang]) {
      let name = emojies[a][lang].name;
      let keywords = emojies[a][lang].keywords;

      if (name === word) {
        variants.push(a);

        break; // самый лучший вариант
      }

      for (let b in keywords) {
        if (keywords[b] === word) {
          variants.push(a);
        }
      }
    }
  }

  return variants[Math.floor(Math.random() * variants.length)];
}