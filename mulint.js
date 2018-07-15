#!/usr/bin/env node

const program = require("commander");

const folderParser = require("./folderParser");

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
    let parsed = folderParser(apiBasePath);
    console.log(parsed);
  })
  .parse(process.argv);
