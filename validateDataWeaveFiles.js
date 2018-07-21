const fs = require("fs");
const path = require("path");
const os = require("os");
const assert = require("./assert");

// Possible false positive - might be line comment
// as opposed to commented-out code.
const commentedOutLineRegEx = /^\s*\/\//;

const validateDataWeaveFiles = folderInfo => {
  folderInfo.dataWeaveFiles.forEach(dataWeaveFile => {
    let context = path.basename(dataWeaveFile);

    let lines = fs
      .readFileSync(dataWeaveFile)
      .toString()
      .split(os.EOL);

    let isCommentedOutLine = false;

    lines.forEach(line => {
      if (commentedOutLineRegEx.test(line)) {
        isCommentedOutLine = true;
      }
    });

    assert.isTrue(!isCommentedOutLine, `${context}: commented-out line found`);
  });
};

module.exports = validateDataWeaveFiles;
