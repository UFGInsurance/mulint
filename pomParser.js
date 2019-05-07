const xmlParser = require("./xmlParser");

const pomParser = (pomFile, detectDeploy) => {
  let { xml } = xmlParser(pomFile);
  let xmlProperties = xml.project.properties[0];
  let properties = new Map();

  for (let property in xmlProperties) {
    properties.set(property, xmlProperties[property][0]);
  }

  let dependencies = xml.project.dependencies[0].dependency;
  let plugins = xml.project.build[0].plugins[0].plugin;

  // Curryable function
  const findElementByArtifactId = elements => artifactId =>
    elements.find(
      element => element.artifactId && element.artifactId[0] === artifactId
    );

  const findDependency = findElementByArtifactId(dependencies);
  const findPlugin = findElementByArtifactId(plugins);

  let muleMavenPlugin = findPlugin("mule-maven-plugin");

  let isOnPrem;
  
  if (detectDeploy) {
    // Currently assuming if not using the Mule Maven Plugin then deploying on-prem.
    isOnPrem =
      !muleMavenPlugin || properties.get("deployment.type") === "arm";
  } else {
    isOnPrem = true;
  }

  return {
    findDependency,
    findPlugin,
    properties,
    muleMavenPlugin,
    isOnPrem,
    xml
  };
};

module.exports = pomParser;
