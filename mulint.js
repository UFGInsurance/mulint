#!/usr/bin/env node

const program = require("commander");
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

program
  .version("0.0.1")
  .description("Mule project linter")
  .arguments("<apiBasePath>")
  .on("--help", () => {
    const path = "C:\\SourceCode\\mulesoft-apis\\System APIs\\wsflx-system-api";
    console.log("");
    console.log("  Example:");
    console.log("");
    console.log(`    mulint "${path}"`);
    console.log("");
    console.log("  (Do not include a trailing backslash in the path argument)");
    console.log("");
  })
  .action(apiBasePath => {
    let folderInfo = folderParser(apiBasePath);
    let pomInfo = pomParser(folderInfo.pomFile);
    validateApiFiles(folderInfo);
    validatePom(folderInfo, pomInfo);
    validateGlobal(folderInfo);
    validateImplementation(folderInfo);
    validateGitignore(folderInfo);
    validateProperties(folderInfo, pomInfo);
    validateLog4j(folderInfo);
    assert.failures.map(failure => console.log(failure));
  })
  .parse(process.argv);
