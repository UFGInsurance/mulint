#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
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
const assert = require("./assert");

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

    printProblemsSummary(assert.failures);
  })
  .parse(process.argv);

function printProblemsSummary(failures) {
  failures.map(failure => console.log(`${chalk.red("error")}  ${failure}`));

  if (failures.length > 0) {
    console.log();
    console.log(chalk.redBright(`${failures.length} problems found`));
  } else {
    console.log(`${chalk.green("No problems found!")}`);
  }
}
