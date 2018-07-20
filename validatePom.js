const assert = require("./assert");

const domainProjectName = "api-gateway";
const expectedDomainProjectVersion = "1.0.1";
const expectedGroupId = "com.unitedfiregroup";
const expectedVersion = "1.0.0";
const expectedFlowRef = "${project.artifactId}-main";

const validatePom = (folderInfo, pomInfo) => {
  let isOnPrem = pomInfo.properties.get("deployment.type") === "arm";
  let dependencies = pomInfo.xml.project.dependencies[0].dependency;

  const findDependency = artifactId =>
    dependencies.find(
      dependency =>
        dependency.artifactId && dependency.artifactId[0] === artifactId
    );

  if (isOnPrem) {
    let domainProject = findDependency(domainProjectName);

    assert.isTrue(domainProject, "No domain project (deploying on-prem)");

    if (domainProject) {
      assert.equals(
        expectedDomainProjectVersion,
        domainProject.version[0],
        "Domain project version"
      );
    }
  }

  assert.isTrue(
    findDependency("common-dataweave"),
    "No common-dataweave project dependency"
  );

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
