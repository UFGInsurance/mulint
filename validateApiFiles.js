const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const error = require("./error");

const expectedListenerConfig = "standardHTTPS";

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

          if (listenerAttributes["config-ref"] !== expectedListenerConfig) {
            folderInfo.issues.push(
              `${apiFileName} http:listener config: expected ${expectedListenerConfig} but was ${
                listenerAttributes["config-ref"]
              }`
            );
          }
        }
      });
    });
  });
};

module.exports = validateApiFiles;
