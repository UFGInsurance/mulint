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
  const implementationFile = path.join(appFolder, "implementation.xml");
  const apiPattern = "*-api.xml";
  const apiFiles = glob.sync(path.join(appFolder, apiPattern));
  const muleAppPropertiesFile = path.join(appFolder, "mule-app.properties");
  const resourcesFolder = path.join(projectFolder, "src", "main", "resources");
  const localPropertiesFile = path.join(
    resourcesFolder,
    "api.local.properties"
  );
  const serverPropertiesFile = path.join(
    resourcesFolder,
    "api.server.properties"
  );
  const log4jFile = path.join(resourcesFolder, "log4j2.xml");
  const dataWeaveFiles = glob.sync(path.join(resourcesFolder, "dwl", "*.dwl"));

  if (!fs.existsSync(projectFolder)) {
    error.fatal(`Project folder "${projectFolder}" not found`);
  }

  if (!fs.existsSync(appFolder)) {
    error.fatal(`App folder "${appFolder}" not found`);
  }

  if (!fs.existsSync(resourcesFolder)) {
    error.fatal(`Resources folder "${resourcesFolder}" not found`);
  }

  if (!fs.existsSync(pomFile)) {
    error.fatal(`POM file "${pomFile}" not found`);
  }

  if (!fs.existsSync(gitignoreFile)) {
    error.fatal(`.gitignore file "${gitignoreFile}" not found`);
  }

  const gitIgnoredFoldersAndFilesRegEx = /src[/\\]main[/\\]api[/\\]\.repository[/\\]|src[/\\]main[/\\]api[/\\]\.gitignore/;

  if (
    search
      .recursiveSearchSync(".gitignore", projectFolder, { all: true })
      .filter(file => !gitIgnoredFoldersAndFilesRegEx.test(file)).length > 1
  ) {
    error.fatal("Multiple .gitignore files found");
  }

  if (!fs.existsSync(globalFile)) {
    error.fatal(`Global file "${globalFile}" not found`);
  }

  if (!fs.existsSync(implementationFile)) {
    error.fatal(`Implementation file "${implementationFile}" not found`);
  }

  if (apiFiles.length === 0) {
    error.fatal(`No ${apiPattern} files found`);
  }

  if (!fs.existsSync(localPropertiesFile)) {
    error.fatal(`Local properties file "${localPropertiesFile}" not found`);
  }

  if (!fs.existsSync(serverPropertiesFile)) {
    error.fatal(`Server properties file "${serverPropertiesFile}" not found`);
  }

  if (!fs.existsSync(log4jFile)) {
    error.fatal(`Log4j file "${log4jFile}" not found`);
  }

  return {
    apiBasePath,
    apiName,
    projectFolder,
    pomFile,
    gitignoreFile,
    appFolder,
    globalFile,
    implementationFile,
    apiFiles,
    muleAppPropertiesFile,
    resourcesFolder,
    localPropertiesFile,
    serverPropertiesFile,
    log4jFile,
    dataWeaveFiles
  };
};

module.exports = folderParser;
