const assert = require("./assert");

const domainProjectName = "api-gateway";
const expectedDomainProjectVersion = "1.0.1";
const expectedGroupId = "com.unitedfiregroup";
const expectedVersion = "1.0.0";
const expectedFlowRef = "${project.artifactId}-main";

const validatePom = (folderInfo, pomInfo) => {
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

  assert.equals(
    folderInfo.apiName,
    pomInfo.xml.project.artifactId[0],
    "POM artifactId"
  );

  assert.equals(expectedVersion, pomInfo.xml.project.version[0], "POM version");

  assert.equals(
    expectedFlowRef,
    pomInfo.properties.get("api.manager.flowref"),
    "POM api.manager.flowref"
  );
};

module.exports = validatePom;
