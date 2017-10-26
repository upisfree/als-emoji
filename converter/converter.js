var fs = require('fs'),
    path = require('path'),
    XmlStream = require('xml-stream'),
    xmlPaths = [],
    jsonPath = 'emojies.json',
    language,
    output = {};

for (let i = 2; i < process.argv.length; i++) {
  xmlPaths.push(path.resolve(process.argv[i]));
}

function convert(xmlPath) {
  let readStream = fs.createReadStream(xmlPath),
      xml = new XmlStream(readStream);

  xml.on('endElement: language', function(item) {
    language = item['$'].type;

    if (!output[language]) {
      output[language] = {
        'names': {},
        'keywords': {}
      };
    }
  });

  xml.on('endElement: annotation', function(item) {
    let symbol = item['$'].cp;

    if (item['$'].type) {
      output[language]['names'][item['$text']] = symbol;
    } else {
      let keywords = item['$text'].split('|');

      for (let i in keywords) {
        let keyword = keywords[i].trim();

        if (!output[language]['keywords'][keyword]) {
          output[language]['keywords'][keyword] = [];
        }

        output[language]['keywords'][keyword].push(symbol);
      }
    }
  });

  xml.on('endElement: ldml', function(item) {
    let path = xmlPaths[xmlPaths.indexOf(xmlPath) + 1];
    
    if (path) {
      convert(path);
    } else {
      fs.writeFile(jsonPath, JSON.stringify(output), function(err) {
        if (err) {
          console.log(err);
        }

        return;
      });
    }
  });

  // errors
  readStream.on('error', function(err) {
    console.log(err);
  });
}

convert(xmlPaths[0]);