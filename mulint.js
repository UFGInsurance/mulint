#!/usr/bin/env node

const program = require("commander");
const folderParser = require("./folderParser");
const validateApiFiles = require("./validateApiFiles");
const validatePom = require("./validatePom");
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
  })
  .action(apiBasePath => {
    let folderInfo = folderParser(apiBasePath);
    validateApiFiles(folderInfo);
    validatePom(folderInfo);
    assert.failures.map(failure => console.error(failure));
  })
  .parse(process.argv);
