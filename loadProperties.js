const fs = require("fs");
const os = require("os");
const { encoding } = require("./constants");

const loadProperties = fileName =>
  fs
    .readFileSync(fileName, encoding)
    .split(os.EOL)
    .reduce((acc, cur) => {
      // Any space between the key and value is removed.
      // Any trailing space is left as is.
      cur = cur.trimLeft();

      if (!cur.startsWith("#") && cur.includes("=")) {
        // Only match the first equals sign.
        // https://stackoverflow.com/questions/4607745/split-string-only-on-first-instance-of-specified-character
        let items = cur.split(/=(.*)/);
        acc.set(items[0].trim(), items[1].trimLeft());
      }

      return acc;
    }, new Map());

module.exports = {
  /**
   * Loads a Java .properties file into a Map.
   * @param {string} fileName The full path of the file.
   * @returns {Map} The property names and values.
   */
  loadProperties
};
