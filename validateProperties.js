const { cloudCIOnlyMavenProperties } = require("./constants");
const fs = require("fs");
const path = require("path");
const assert = require("./assert");
const sensitive = require("./sensitive");
const { loadProperties } = require("./loadProperties");

const validateProperties = (folderInfo, pomInfo) => {
  let localProperties = loadProperties(folderInfo.localPropertiesFile);
  let serverProperties = loadProperties(folderInfo.serverPropertiesFile);
  let localContext = path.basename(folderInfo.localPropertiesFile);
  let serverContext = path.basename(folderInfo.serverPropertiesFile);

  if (fs.existsSync(folderInfo.muleAppPropertiesFile)) {
    assert.isTrue(
      loadProperties(folderInfo.muleAppPropertiesFile).size === 0,
      `${path.basename(folderInfo.muleAppPropertiesFile)} contains properties`
    );
  }

  assert.isTrue(
    Array.from(localProperties.values()).every(x => !x.endsWith(" ")),
    `${localContext}: trailing spaces found`
  );

  assert.isTrue(
    Array.from(serverProperties.values()).every(x => !x.endsWith(" ")),
    `${serverContext}: trailing spaces found`
  );

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

  localProperties.forEach((value, key) => {
    assert.isTrue(
      serverProperties.has(key),
      `${serverContext}: ${key} from ${localContext} not found`
    );

    if (sensitive.isSensitive(key, value)) {
      assert.fail(`${localContext}: ${key} may contain sensitive information`);
    }
  });

  serverProperties.forEach((value, key) => {
    assert.isTrue(
      localProperties.has(key),
      `${localContext}: ${key} from ${serverContext} not found`
    );

    if (!key.startsWith("api.manager.")) {
      assert.equals("${" + key + "}", value, `${serverContext} ${key}`);
    }
  });

  localProperties.forEach((value, key) => {
    let foundInPom = pomInfo.properties.has(key);

    assert.isTrue(
      foundInPom,
      `POM: ${key} property from ${localContext} not found`
    );

    if (
      foundInPom &&
      key !== "api.manager.flowref" &&
      !key.includes("database") &&
      !key.includes("sql")
    ) {
      assert.equals(value, pomInfo.properties.get(key), `POM ${key}`);
    }
  });

  if (!pomInfo.isOnPrem) {
    // CloudHub

    assert.isTrue(
      serverProperties.has("https.port"),
      `${serverContext}: https.port property not found (deploying to CloudHub)`
    );
    // Note that we have already checked for property placeholders.

    cloudCIOnlyMavenProperties.forEach(ciOnlyProperty => {
      assert.isTrue(
        !localProperties.has(ciOnlyProperty),
        `${localContext}: ${ciOnlyProperty} property found (should not be stored)`
      );

      assert.isTrue(
        !serverProperties.has(ciOnlyProperty),
        `${serverContext}: ${ciOnlyProperty} property found (should not be stored)`
      );
    });
  }
};

module.exports = validateProperties;
