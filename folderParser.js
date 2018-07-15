const fs = require("fs");
const path = require("path");
const glob = require("glob");

const folderParser = apiBasePath => {
  if (!fs.existsSync(apiBasePath)) {
    console.error(`apiBasePath "${apiBasePath}" not found`);
    process.exit(1);
  }

  const apiName = path.basename(apiBasePath);
  const projectFolder = path.join(apiBasePath, "impl", apiName);
  const pomFile = path.join(projectFolder, "pom.xml");
  const appFolder = path.join(projectFolder, "src", "main", "app");
  const apiFiles = glob.sync(path.join(appFolder, "*-api.xml"));

  if (!fs.existsSync(pomFile)) {
    console.error(`POM file "${pomFile}" not found`);
    process.exit(1);
  }

  if (apiFiles.length === 0) {
    console.error("No *-api.xml files found");
    process.exit(1);
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
