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
const { loadProperties } = require("./loadProperties");

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

function internalValidateProperties(folderInfo, pomInfo) {
  let localProperties = loadProperties(folderInfo.localPropertiesFile);
  let serverProperties = loadProperties(folderInfo.serverPropertiesFile);

  let muleAppProperties = fs.existsSync(folderInfo.muleAppPropertiesFile)
    ? loadProperties(folderInfo.muleAppPropertiesFile)
    : new Map();

  validateProperties(
    localProperties,
    serverProperties,
    muleAppProperties,
    folderInfo,
    pomInfo
  );
}

function internalValidateLog4j(folderInfo) {
  let { xml } = xmlParser(folderInfo.log4jFile);

  validateLog4j(xml, folderInfo);
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
    internalValidateProperties(folderInfo, pomInfo);
    internalValidateLog4j(folderInfo);

    reporter.printSummary(assert.failures);
  }
};
