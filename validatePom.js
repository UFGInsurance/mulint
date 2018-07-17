const fs = require("fs");
const xml2js = require("xml2js");
const error = require("./error");
const assert = require("./assert");

const domainProjectName = "api-gateway";
const expectedDomainProjectVersion = "1.0.1";

const validatePom = folderInfo => {
  let contents = fs.readFileSync(folderInfo.pomFile);
  let parser = new xml2js.Parser();

  parser.parseString(contents, (err, result) => {
    if (err) {
      error.fatal(err);
    }

    let isOnPrem = result.project.properties[0]["deployment.type"][0] === "arm";

    if (isOnPrem) {
      let dependencies = result.project.dependencies[0].dependency;

      let domainProject = dependencies.find(
        dependency =>
          dependency.artifactId &&
          dependency.artifactId[0] === domainProjectName
      );

      assert.isTrue(domainProject, "No domain project (deploying on-prem)");

      if (domainProject) {
        assert.equals(
          expectedDomainProjectVersion,
          String(domainProject.version),
          "Domain project version"
        );
      }
    }
  });
};

module.exports = validatePom;
