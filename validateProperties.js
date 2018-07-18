const fs = require("fs");
const path = require("path");
const os = require("os");
const assert = require("./assert");

// Loads a Java .properties file into a Map.
const loadProperties = fileName =>
  fs
    .readFileSync(fileName)
    .toString()
    .split(os.EOL)
    .reduce((acc, cur) => {
      cur = cur.trim();

      if (!cur.startsWith("#") && cur.includes("=")) {
        let items = cur.split("=").map(x => x.trim());
        acc.set(items[0], items[1]);
      }

      return acc;
    }, new Map());

const validateProperties = folderInfo => {
  let localProperties = loadProperties(folderInfo.localPropertiesFile);
  let serverProperties = loadProperties(folderInfo.serverPropertiesFile);
  let localContext = path.basename(folderInfo.localPropertiesFile);
  let serverContext = path.basename(folderInfo.serverPropertiesFile);

  assert.matches(
    new RegExp("^groupId:.+:assetId:" + folderInfo.apiName + "$"),
    localProperties.get("api.manager.name"),
    `${localContext} api.manager.name`
  );

  assert.matches(
    /^v1:/,
    localProperties.get("api.manager.version"),
    `${localContext} api.manager.version`
  );

  assert.equals(
    `${folderInfo.apiName}-main`,
    localProperties.get("api.manager.flowref"),
    `${localContext} api.manager.flowref`
  );

  assert.equals(
    "${api.manager.name}",
    serverProperties.get("api.manager.name"),
    `${serverContext} api.manager.name`
  );

  assert.equals(
    "${api.manager.version}",
    serverProperties.get("api.manager.version"),
    `${serverContext} api.manager.version`
  );

  assert.equals(
    "${api.manager.flowref}",
    serverProperties.get("api.manager.flowref"),
    `${serverContext} api.manager.flowref`
  );

  // TODO: Check that other properties have matching values and check POM
};

module.exports = validateProperties;
