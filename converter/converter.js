var fs = require('fs'),
    path = require('path'),
    XmlStream = require('xml-stream'),
    JSONStream = require('JSONStream'),
    xmlPath = path.resolve(process.argv[2]),
    jsonPath = process.argv[3],
    language,
    output = {};

// second argument
if (jsonPath) {
  jsonPath = path.resolve(jsonPath);
  output = require(jsonPath);
} else {
  jsonPath = 'emojies.json';
}

var readStream = fs.createReadStream(xmlPath),
    writeStream = fs.createWriteStream(jsonPath),
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
  } else {
    output[symbol][language].keywords = item['$text'].replace(/\s\|/g, '');
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