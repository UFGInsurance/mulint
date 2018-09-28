const { propertyPlaceholderRegEx } = require("./constants");
const fs = require("fs");
const xml2js = require("xml2js");
const error = require("./error");
const assert = require("./assert");

const expectedTlsContext = "clientTlsContext";

const validateGlobal = folderInfo => {
  let contents = fs.readFileSync(folderInfo.globalFile);
  let parser = new xml2js.Parser();

  assert.isTrue(
    !contents.includes("<db:dynamic-query>"),
    "Global: Dynamic query is not permitted - vulnerable to SQL injection"
  );

  parser.parseString(contents, (err, result) => {
    if (err) {
      error.fatal(err);
    }

    assert.isTrue(
      result.mule["api-platform-gw:api"] &&
        result.mule["api-platform-gw:api"][0]["$"]["doc:name"] ===
          "API Autodiscovery",
      "Global: API Autodiscovery not configured"
    );

    let requestConfigs = result.mule["http:request-config"];

    if (requestConfigs) {
      requestConfigs.forEach(requestConfig => {
        let requestConfigAttributes = requestConfig["$"];

        let protocol = requestConfigAttributes.protocol;
        let host = requestConfigAttributes["host"];
        let usesMockService = host && host.includes("mock");

        if (usesMockService) {
          return; // continue forEach, skip remaining checks
        }

        if (protocol === "HTTPS") {
          let tlsContext = requestConfigAttributes["tlsContext-ref"];

          assert.equals(
            expectedTlsContext,
            tlsContext,
            `Global ${requestConfigAttributes.name} tlsContext`
          );
        }

        assert.matches(
          propertyPlaceholderRegEx,
          requestConfigAttributes.host,
          `Global ${requestConfigAttributes.name} host`
        );

        assert.matches(
          propertyPlaceholderRegEx,
          requestConfigAttributes.port,
          `Global ${requestConfigAttributes.name} port`
        );
      });
    }

    let templateQueries = result.mule["db:template-query"];

    if (templateQueries) {
      templateQueries.forEach(templateQuery => {
        let query = templateQuery["db:parameterized-query"];

        if (query) {
          let queryAttributes = query[0]["$"];
          let isFileQuery = queryAttributes && queryAttributes.file;

          assert.isTrue(
            isFileQuery,
            "Global: Inline SQL should be moved to file"
          );

          if (isFileQuery) {
            assert.matches(
              /^sql\//,
              queryAttributes.file,
              "Global: Database query file"
            );
          }
        }
      });
    }
  });
};

module.exports = validateGlobal;
