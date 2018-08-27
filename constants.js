const propertyPlaceholderRegEx = /^\${.+}$/;

// Maven properties added by TeamCity that should not be stored in project
const cloudCIOnlyMavenProperties = [
  "anypoint.platform.client_id",
  "anypoint.platform.client_secret"
];

module.exports = {
  propertyPlaceholderRegEx,
  cloudCIOnlyMavenProperties
};
