const assert = require("./assert");

const domainProjectName = "api-gateway";
const expectedDomainProjectVersion = "1.0.1";
const expectedGroupId = "com.unitedfiregroup";

const validatePom = pomInfo => {
  let isOnPrem = pomInfo.properties.get("deployment.type") === "arm";

  if (isOnPrem) {
    let dependencies = pomInfo.xml.project.dependencies[0].dependency;

    let domainProject = dependencies.find(
      dependency =>
        dependency.artifactId && dependency.artifactId[0] === domainProjectName
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

  assert.isTrue(!pomInfo.properties.has("type"), "POM: <type> not removed");

  assert.equals(expectedGroupId, pomInfo.xml.project.groupId[0], "POM groupId");
};

module.exports = validatePom;
