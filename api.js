/**
 * @fileoverview Heart of the app, making it possible to call programmatically.
 * Equivalent to cli.js in https://eslint.org/docs/developer-guide/architecture
 */

const reporter = require("./reporter");
const folderParser = require("./folderParser");
const pomParser = require("./pomParser");
const validateApiFiles = require("./validateApiFiles");
const validatePom = require("./validatePom");
const validateGlobal = require("./validateGlobal");
const validateImplementation = require("./validateImplementation");
const validateGitignore = require("./validateGitignore");
const validateProperties = require("./validateProperties");
const validateLog4j = require("./validateLog4j");
const assert = require("./assert");

module.exports = {
  execute(apiBasePath) {
    let folderInfo = folderParser(apiBasePath);
    let pomInfo = pomParser(folderInfo.pomFile);
    validateApiFiles(folderInfo, pomInfo);
    validatePom(folderInfo, pomInfo);
    validateGlobal(folderInfo);
    validateImplementation(folderInfo);
    validateGitignore(folderInfo);
    validateProperties(folderInfo, pomInfo);
    validateLog4j(folderInfo);

    reporter.printSummary(assert.failures);
  }
};
