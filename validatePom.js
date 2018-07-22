const assert = require("./assert");

const domainProjectName = "api-gateway";
const expectedDomainProjectVersion = "1.0.1";
const expectedGroupId = "com.unitedfiregroup";
const expectedVersion = "1.0.0";
const expectedFlowRef = "${project.artifactId}-main";
const mavenRepository =
  "https://ufginsurance.jfrog.io/ufginsurance/libs-release-local";

const validatePom = (folderInfo, pomInfo) => {
  let dependencies = pomInfo.xml.project.dependencies[0].dependency;

  const findDependency = artifactId =>
    dependencies.find(
      dependency =>
        dependency.artifactId && dependency.artifactId[0] === artifactId
    );

  let domainProject = findDependency(domainProjectName);

  if (pomInfo.isOnPrem) {
    assert.isTrue(domainProject, "No domain project (deploying on-prem)");

    if (domainProject) {
      assert.equals(
        expectedDomainProjectVersion,
        domainProject.version[0],
        "Domain project version"
      );
    }
  } else {
    // CloudHub

    assert.isTrue(
      !domainProject,
      "Domain project used (deploying to CloudHub)"
    );
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

  let distributionManagement = pomInfo.xml.project.distributionManagement;

  assert.isTrue(
    distributionManagement &&
      distributionManagement[0].repository[0].url[0] === mavenRepository,
    "POM: Maven repository (Artifactory) not configured"
  );
};

module.exports = validatePom;
