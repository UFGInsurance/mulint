const fs = require("fs");
const xml2js = require("xml2js");
const error = require("./error");
const { encoding } = require("./constants");

const xmlParser = file => {
  let contents = fs.readFileSync(file, encoding);
  let parser = new xml2js.Parser();
  let xml;

  // synchronous by default in current version of xml2js
  parser.parseString(contents, (err, result) => {
    if (err) {
      error.fatal(`Unable to parse XML file "${file}": ${err}`);
    }

    xml = result;
  });

  return {
    contents,
    xml
  };
};

module.exports = xmlParser;
