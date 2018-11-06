const xmlParser = require("./xmlParser");

const pomParser = pomFile => {
  let { xml } = xmlParser(pomFile);
  let xmlProperties = xml.project.properties[0];
  let properties = new Map();

  for (let property in xmlProperties) {
    properties.set(property, xmlProperties[property][0]);
  }

  let isOnPrem = properties.get("deployment.type") === "arm";

  return {
    properties,
    isOnPrem,
    xml
  };
};

module.exports = pomParser;
