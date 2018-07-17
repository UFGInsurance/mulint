const fs = require("fs");
const path = require("path");
const glob = require("glob");
const search = require("recursive-search");
const error = require("./error");

const folderParser = apiBasePath => {
  if (!fs.existsSync(apiBasePath)) {
    error.fatal(`apiBasePath "${apiBasePath}" not found`);
  }

  const apiName = path.basename(apiBasePath);
  const projectFolder = path.join(apiBasePath, "impl", apiName);
  const pomFile = path.join(projectFolder, "pom.xml");
  const gitignoreFile = path.join(projectFolder, ".gitignore");
  const appFolder = path.join(projectFolder, "src", "main", "app");
  const globalFile = path.join(appFolder, "global.xml");
  const apiPattern = "*-api.xml";
  const apiFiles = glob.sync(path.join(appFolder, apiPattern));

  if (!fs.existsSync(pomFile)) {
    error.fatal(`POM file "${pomFile}" not found`);
  }

  if (!fs.existsSync(gitignoreFile)) {
    error.fatal(`.gitignore file "${gitignoreFile}" not found`);
  }

  if (
    search.recursiveSearchSync(".gitignore", projectFolder, { all: true })
      .length > 1
  ) {
    error.fatal("Multiple .gitignore files found");
  }

  if (!fs.existsSync(globalFile)) {
    error.fatal(`Global file "${globalFile}" not found`);
  }

  if (apiFiles.length === 0) {
    error.fatal(`No ${apiPattern} files found`);
  }

  return {
    apiBasePath,
    apiName,
    projectFolder,
    pomFile,
    gitignoreFile,
    globalFile,
    apiFiles
  };
};

module.exports = folderParser;
