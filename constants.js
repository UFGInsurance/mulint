const propertyPlaceholderRegEx = /^\${.+}$/;
const propertyPlaceholderAnywhereRegEx = /\${.+}/;

// Maven properties added by TeamCity that should not be stored in project
const cloudCIOnlyMavenProperties = [
  "anypoint.platform.client_id",
  "anypoint.platform.client_secret"
];

const encoding = "utf8";

module.exports = {
  propertyPlaceholderRegEx,
  propertyPlaceholderAnywhereRegEx,
  cloudCIOnlyMavenProperties,
  encoding
};
