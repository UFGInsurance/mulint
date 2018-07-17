const fs = require("fs");
const xml2js = require("xml2js");
const error = require("./error");
const assert = require("./assert");

const expectedTlsContext = "clientTlsContext";

const validateGlobal = folderInfo => {
  let contents = fs.readFileSync(folderInfo.globalFile);
  let parser = new xml2js.Parser();

  parser.parseString(contents, (err, result) => {
    if (err) {
      error.fatal(err);
    }

    let requestConfig = result.mule["http:request-config"];

    if (requestConfig) {
      let tlsContext = requestConfig[0]["$"]["tlsContext-ref"];

      assert.equals(
        expectedTlsContext,
        tlsContext,
        "Global http:request-config tlsContext"
      );
    }
  });
};

module.exports = validateGlobal;
