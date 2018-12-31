/**
 * @fileoverview Heart of the app, making it possible to call programmatically.
 * Anything below this should not do any I/O (reads, writes, console, etc.).
 * Equivalent to cli.js in https://eslint.org/docs/developer-guide/architecture
 */

const path = require("path");
const fs = require("fs");
const xmlParser = require("./xmlParser");
const reporter = require("./reporter");
const folderParser = require("./folderParser");
const pomParser = require("./pomParser");
const validateApiFile = require("./validateApiFile");
const validatePom = require("./validatePom");
const validateGlobal = require("./validateGlobal");
const validateImplementationFile = require("./validateImplementationFile");
const validateGitignore = require("./validateGitignore");
const validateProperties = require("./validateProperties");
const validateLog4j = require("./validateLog4j");
const { encoding } = require("./constants");
const assert = require("./assert");

function validateApiFiles(folderInfo, pomInfo) {
  folderInfo.apiFiles.forEach(apiFile => {
    let apiFileName = path.basename(apiFile);
    let { xml } = xmlParser(apiFile);

    validateApiFile(apiFileName, xml, pomInfo);
  });
}

function validateImplementationFiles(folderInfo) {
  folderInfo.implementationFiles.forEach(implementationFile => {
    let implementationFileName = path.basename(implementationFile);
    let { contents, xml } = xmlParser(implementationFile);

    validateImplementationFile(implementationFileName, contents, xml);
  });
}

function internalValidateGlobal(folderInfo) {
  let { contents, xml } = xmlParser(folderInfo.globalFile);
  validateGlobal(contents, xml);
}

module.exports = {
  execute(apiBasePath) {
    let folderInfo = folderParser(apiBasePath);
    let pomInfo = pomParser(folderInfo.pomFile);
    validateApiFiles(folderInfo, pomInfo);
    validatePom(folderInfo, pomInfo);
    internalValidateGlobal(folderInfo);
    validateImplementationFiles(folderInfo);
    validateGitignore(fs.readFileSync(folderInfo.gitignoreFile, encoding));
    validateProperties(folderInfo, pomInfo);
    validateLog4j(folderInfo);

    reporter.printSummary(assert.failures);
  }
};
