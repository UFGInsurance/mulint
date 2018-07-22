const fs = require("fs");
const xml2js = require("xml2js");
const error = require("./error");

const pomParser = pomFile => {
  let contents = fs.readFileSync(pomFile);
  let parser = new xml2js.Parser();
  let properties = new Map();
  let xml;

  // synchronous by default in current version of xml2js
  parser.parseString(contents, (err, result) => {
    if (err) {
      error.fatal(err);
    }

    xml = result;

    let xmlProperties = xml.project.properties[0];

    for (let property in xmlProperties) {
      properties.set(property, xmlProperties[property][0]);
    }
  });

  let isOnPrem = properties.get("deployment.type") === "arm";

  return {
    properties,
    isOnPrem,
    xml
  };
};

module.exports = pomParser;
