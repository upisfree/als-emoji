var fs = require('fs'),
    XmlStream = require('xml-stream'),
    JSONStream = require('JSONStream'),
    file = process.argv[2],
    language,
    output = {};

var readStream = fs.createReadStream(file),
    writeStream = fs.createWriteStream('out.json'),
    jsonStream = JSONStream.stringifyObject('{', ',', '}'),
    xml = new XmlStream(readStream);

jsonStream.pipe(writeStream);

xml.on('endElement: language', function(item) {
  language = item['$'].type;
});

xml.on('endElement: annotation', function(item) {
  let symbol = item['$'].cp;

  if (!output[symbol]) {
    output[symbol] = {};
  }

  if (!output[symbol][language]) {
    output[symbol][language] = {};
  }

  if (item['$'].type) {
    output[symbol][language].name = item['$text'];
    // output[symbol].name = item['$text'];
  } else {
    output[symbol][language].keywords = item['$text'].replace(/\s\|/g, '');
    // output[symbol].keywords = item['$text'];
  }

  if (output[symbol][language].name && output[symbol][language].keywords) {
    jsonStream.write([symbol, output[symbol]])
  }
});

xml.on('endElement: ldml', function(item) {
  jsonStream.end();
});

// errors
readStream.on('error', function(err) {
  console.log(err);
});