#!/usr/bin/env node

/**
 * @fileoverview Main CLI that is run via the mulint command.
 */

const program = require("commander");
const api = require("./api");

program
  .version("2.0.1")
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

    api.execute(apiBasePath);
  })
  .parse(process.argv);
