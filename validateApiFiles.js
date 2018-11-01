const xmlParser = require("./xmlParser");
const path = require("path");
const assert = require("./assert");

const expectedOnPremListenerConfig = "standardHTTPS";
const expectedListenerPathRegEx = /^\/(?:console|api)\/.+\/v1\/(?:.+\/)?\*$/;

const validateApiFiles = (folderInfo, pomInfo) => {
  folderInfo.apiFiles.forEach(apiFile => {
    let apiFileName = path.basename(apiFile);
    let { xml } = xmlParser(apiFile);

    xml.mule.flow.map(flow => {
      let listener = flow["http:listener"];

      if (listener) {
        let listenerAttributes = listener[0]["$"];

        if (pomInfo.isOnPrem) {
          assert.equals(
            expectedOnPremListenerConfig,
            listenerAttributes["config-ref"],
            `${apiFileName} http:listener config`
          );
        }

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
          "ChoiceExceptionStrategy",
          exceptionStrategyAttributes.ref,
          `${apiFileName} exception-strategy ref`
        );
      }
    });

    assert.isTrue(
      !xml.mule["apikit:mapping-exception-strategy"],
      `${apiFileName}: APIkit exception strategy not removed`
    );
  });
};

module.exports = validateApiFiles;
