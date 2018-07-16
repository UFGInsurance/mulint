const fs = require("fs");
const path = require("path");
const glob = require("glob");
const error = require("./error");

const folderParser = apiBasePath => {
  if (!fs.existsSync(apiBasePath)) {
    error.fatal(`apiBasePath "${apiBasePath}" not found`);
  }

  const apiName = path.basename(apiBasePath);
  const projectFolder = path.join(apiBasePath, "impl", apiName);
  const pomFile = path.join(projectFolder, "pom.xml");
  const appFolder = path.join(projectFolder, "src", "main", "app");
  const apiPattern = "*-api.xml";
  const apiFiles = glob.sync(path.join(appFolder, apiPattern));

  if (!fs.existsSync(pomFile)) {
    error.fatal(`POM file "${pomFile}" not found`);
  }

  if (apiFiles.length === 0) {
    error.fatal(`No ${apiPattern} files found`);
  }

  return {
    apiBasePath,
    apiName,
    projectFolder,
    pomFile,
    apiFiles
  };
};

module.exports = folderParser;
