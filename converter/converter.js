var fs = require('fs'),
    path = require('path'),
    XmlStream = require('xml-stream'),
    inPaths = [],
    outPath = 'emojies.json',
    language,
    output = {};

if (process.argv.length === 3 && fs.lstatSync(process.argv[2]).isDirectory()) {
  let folder = process.argv[2];

  fs.readdirSync(folder).forEach(function(file) {
    if (path.extname(file) === '.xml') {
      inPaths.push(path.resolve(folder, file));
    }
  });
} else {
  for (let i = 2; i < process.argv.length; i++) {
    inPaths.push(path.resolve(process.argv[i]));
  }  
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
    let path = inPaths[inPaths.indexOf(xmlPath) + 1];
    
    if (path) {
      convert(path);
    } else {
      fs.writeFile(outPath, JSON.stringify(output), function(err) {
        if (err) {
          console.log(err);
        }

        console.log('Done!');

        return;
      });
    }
  });

  readStream.on('error', function(err) {
    console.log(err);
  });
}

convert(inPaths[0]);