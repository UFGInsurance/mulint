const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const error = require("./error");
const assert = require("./assert");

const expectedListenerConfig = "standardHTTPS";
const expectedListenerPathRegEx = /^\/(?:console|api)\/.+\/v1\/\*$/;

const validateApiFiles = folderInfo => {
  folderInfo.apiFiles.forEach(apiFile => {
    let apiFileName = path.basename(apiFile);
    let contents = fs.readFileSync(apiFile);
    let parser = new xml2js.Parser();

    parser.parseString(contents, (err, result) => {
      if (err) {
        error.fatal(err);
      }

      result.mule.flow.map(flow => {
        let listener = flow["http:listener"];

        if (listener) {
          let listenerAttributes = listener[0]["$"];

          assert.equals(
            expectedListenerConfig,
            listenerAttributes["config-ref"],
            `${apiFileName} http:listener config`
          );

          assert.matches(
            expectedListenerPathRegEx,
            listenerAttributes["path"],
            `${apiFileName} http:listener path`
          );
        }

        let exceptionStrategy = flow["exception-strategy"];

        assert.isTrue(
          exceptionStrategy,
          `${apiFileName}: Missing exception strategy`
        );

        if (exceptionStrategy) {
          let exceptionStrategyAttributes = exceptionStrategy[0]["$"];

          assert.equals(
            "Reference Exception Strategy",
            exceptionStrategyAttributes["doc:name"],
            `${apiFileName} exception-strategy name`
          );

          assert.equals(
            "ChoiceExceptionStrategy",
            exceptionStrategyAttributes.ref,
            `${apiFileName} exception-strategy ref`
          );
        }
      });

      assert.isTrue(
        !result.mule["apikit:mapping-exception-strategy"],
        `${apiFileName}: APIkit exception strategy not removed`
      );
    });
  });
};

module.exports = validateApiFiles;
