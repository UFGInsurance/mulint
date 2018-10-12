const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const error = require("./error");
const assert = require("./assert");

// XML elements immediately below the root other than
// configuration and exception strategies
// - there does not appear to be another way to distinguish these
// ($ is used by xml2js to access attributes)
const permittedTopLevelElements = new Set([
  "$",
  "flow",
  "sub-flow",
  "batch:job",
  "until-successful"
]);

const validateImplementation = folderInfo => {
  folderInfo.implementationFiles.forEach(implementationFile => {
    let implementationFileName = path.basename(implementationFile);
    let contents = fs.readFileSync(implementationFile);
    let parser = new xml2js.Parser();

    assert.isTrue(
      !contents.includes("<db:dynamic-query>"),
      `${implementationFileName}: Dynamic query is not permitted - vulnerable to SQL injection`
    );

    assert.isTrue(
      !contents.includes("<db:parameterized-query>"),
      `${implementationFileName}: Inline SQL should be moved to file/template`
    );

    parser.parseString(contents, (err, result) => {
      if (err) {
        error.fatal(err);
      }

      for (let topLevelElement in result.mule) {
        assert.isTrue(
          permittedTopLevelElements.has(topLevelElement),
          `${implementationFileName}: ${topLevelElement} is not permitted`
        );
      }
    });
  });
};

module.exports = validateImplementation;
