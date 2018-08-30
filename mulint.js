#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const context = require("./context");
const reporter = require("./reporter");
const gitignore = require("./validation/gitignoreValidation");
const folderParser = require("./folderParser");
const pomParser = require("./pomParser");
const validateApiFiles = require("./validateApiFiles");
const validatePom = require("./validatePom");
const validateGlobal = require("./validateGlobal");
const validateImplementation = require("./validateImplementation");
const validateGitignore = require("./validateGitignore");
const validateProperties = require("./validateProperties");
const validateLog4j = require("./validateLog4j");
const validateDataWeaveFiles = require("./validateDataWeaveFiles");

program
  .version("1.1.1")
  .description("Mule project linter")
  .arguments("<apiBasePath>")
  .on("--help", () => {
    const path = "C:\\SourceCode\\mulesoft-apis\\System APIs\\wsflx-system-api";
    console.log("");
    console.log("  Example:");
    console.log("");
    console.log(`    mulint "${path}"`);
    console.log("");
  })
  .action(apiBasePath => {
    // Workaround for https://github.com/PowerShell/PowerShell/issues/7400
    apiBasePath = apiBasePath.replace(/"$/, "");

    let folderInfo = folderParser(apiBasePath);
    let pomInfo = pomParser(folderInfo.pomFile);

    validateApiFiles(folderInfo, pomInfo);
    validatePom(folderInfo, pomInfo);
    validateGlobal(folderInfo);
    validateImplementation(folderInfo);
    validateGitignore(folderInfo);
    validateProperties(folderInfo, pomInfo);
    validateLog4j(folderInfo);
    validateDataWeaveFiles(folderInfo);

    const muleContext = context.create(folderInfo, pomInfo);
    gitignore.validate(muleContext, reporter);
    reporter.printSummary();
  })
  .parse(process.argv);
