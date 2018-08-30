const {
  propertyPlaceholderRegEx,
  cloudCIOnlyMavenProperties
} = require("./constants");
const assert = require("./assert");

const domainProjectName = "api-gateway";
const expectedDomainProjectVersion = "1.0.1";
const expectedGroupId = "com.unitedfiregroup";
const expectedVersion = "1.0.0";
const expectedFlowRef = "${project.artifactId}-main"; // may be inlined
const mavenRepository =
  "https://ufginsurance.jfrog.io/ufginsurance/libs-release-local";

const isFalse = expression => !expression;

module.exports = {
  validate({ pom }, reporter) {
    let dependencies = pom.xml.project.dependencies[0].dependency;
    let plugins = pom.xml.project.build[0].plugins[0].plugin;

    // Curryable function
    const findElementByArtifactId = elements => artifactId =>
      elements.find(
        element => element.artifactId && element.artifactId[0] === artifactId
      );

    let findDependency = findElementByArtifactId(dependencies);
    let findPlugin = findElementByArtifactId(plugins);

    let domainProject = findDependency(domainProjectName);

    if (pom.isOnPrem) {
      if (isFalse(domainProject)) {
        reporter.report({
          category: "pom.xml",
          message: "No domain project (deploying on-prem)"
        });
      }

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

      let muleMavenPlugin = findPlugin("mule-maven-plugin");

      if (muleMavenPlugin && muleMavenPlugin.configuration) {
        let mavenProperties = muleMavenPlugin.configuration[0].properties;

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
            !pom.properties.has(ciOnlyProperty),
            `POM: ${ciOnlyProperty} property found (should only be plugin placeholder)`
          );
        });
      }
    }

    assert.isTrue(
      findDependency("common-dataweave"),
      "No 'common-dataweave' project dependency"
    );

    assert.isTrue(!pom.properties.has("type"), "POM: <type> not removed");

    assert.equals(expectedGroupId, pom.xml.project.groupId[0], "POM groupId");

    let projectArtifactId = pom.xml.project.artifactId[0];

    assert.equals(folderInfo.apiName, projectArtifactId, "POM artifactId");

    assert.equals(expectedVersion, pom.xml.project.version[0], "POM version");

    let apiManagerFlowref = pom.properties.get("api.manager.flowref");
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

    let distributionManagement = pom.xml.project.distributionManagement;

    assert.isTrue(
      distributionManagement &&
        distributionManagement[0].repository[0].url[0] === mavenRepository,
      "POM: Maven repository (Artifactory) not configured"
    );
  }
};
