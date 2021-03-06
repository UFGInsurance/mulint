const {
  propertyPlaceholderRegEx,
  cloudCIOnlyMavenProperties
} = require("./constants");
const assert = require("./assert");
const sensitive = require("./sensitive");

const domainProjectName = "api-gateway";
const expectedDomainProjectVersionRegEx = /^1\.0\.[3-9]$/;
const expectedGroupId = "com.unitedfiregroup";
const expectedFlowRef = "${project.artifactId}-main"; // may be inlined
const mavenRepository =
  "https://ufginsurance.jfrog.io/ufginsurance/libs-release-local";

const validatePom = (folderInfo, pomInfo) => {
  let domainProject = pomInfo.findDependency(domainProjectName);

  if (pomInfo.isOnPrem) {
    assert.isTrue(domainProject, "No domain project (deploying on-prem)");

    if (domainProject) {
      assert.matches(
        expectedDomainProjectVersionRegEx,
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

    if (pomInfo.muleMavenPlugin && pomInfo.muleMavenPlugin.configuration) {
      let mavenProperties = pomInfo.muleMavenPlugin.configuration[0].properties;

      if (mavenProperties) {
        cloudCIOnlyMavenProperties.forEach(ciOnlyProperty => {
          let actualProperty = mavenProperties[0][ciOnlyProperty];

          if (actualProperty) {
            assert.matches(
              propertyPlaceholderRegEx,
              actualProperty[0],
              `POM ${ciOnlyProperty}`
            );
          }
        });
      }

      // Check properties section too
      cloudCIOnlyMavenProperties.forEach(ciOnlyProperty => {
        assert.isTrue(
          !pomInfo.properties.has(ciOnlyProperty),
          `POM: ${ciOnlyProperty} property found (should only be plugin placeholder)`
        );
      });
    }
  }

  assert.isTrue(
    pomInfo.findDependency("common-dataweave"),
    "No 'common-dataweave' project dependency"
  );

  assert.isTrue(!pomInfo.properties.has("type"), "POM: <type> not removed");

  assert.equals(expectedGroupId, pomInfo.xml.project.groupId[0], "POM groupId");

  let projectArtifactId = pomInfo.xml.project.artifactId[0];

  assert.equals(folderInfo.apiName, projectArtifactId, "POM artifactId");

  let apiManagerFlowref = pomInfo.properties.get("api.manager.flowref");
  let alternateExpectedFlowRef = expectedFlowRef.replace(
    "${project.artifactId}",
    projectArtifactId
  );

  if (
    apiManagerFlowref !== expectedFlowRef &&
    apiManagerFlowref !== alternateExpectedFlowRef
  ) {
    assert.fail(
      `POM api.manager.flowref: expected "${expectedFlowRef}" or "${alternateExpectedFlowRef}" but was "${apiManagerFlowref}"`
    );
  }

  let distributionManagement = pomInfo.xml.project.distributionManagement;

  assert.isTrue(
    distributionManagement &&
      distributionManagement[0].repository[0].url[0] === mavenRepository,
    "POM: Maven repository (Artifactory) not configured"
  );

  pomInfo.properties.forEach((value, key) => {
    if (sensitive.isSensitive(key, value)) {
      assert.fail(`POM: ${key} may contain sensitive information`);
    }
  });
};

module.exports = validatePom;
