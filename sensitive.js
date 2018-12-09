const { propertyPlaceholderRegEx } = require("./constants");

const sensitiveKeyRegEx = /password|pwd/i;

// Primarily for Microsoft SQL Server connection strings
// Negative lookahead - "password=" not followed by "replace" or "${"
// (Case-insensitive, ignoring whitespace)
const sensitiveValueRegEx = /password\s*=(?!\s*(?:replace|\${))/i;

const securedPropertyRegEx = /^!\[.+\]$/;

const isSensitive = (key, value) =>
  (sensitiveKeyRegEx.test(key) &&
    !value.toUpperCase().includes("REPLACE") &&
    !securedPropertyRegEx.test(value) &&
    !propertyPlaceholderRegEx.test(value)) ||
  sensitiveValueRegEx.test(value);

module.exports = {
  isSensitive
};
