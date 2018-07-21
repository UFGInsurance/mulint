const fs = require("fs");
const path = require("path");
const os = require("os");
const assert = require("./assert");

// Possible false positive - might be line comment
// as opposed to commented-out code.
const commentedOutLineRegEx = /^\s*\/\//;
const commonLibraryVariableDeclarationRegEx = /^\s*%var\s+(\S+)\s*=\s*readUrl.+common-formatting-lib/;

const validateDataWeaveFiles = folderInfo => {
  folderInfo.dataWeaveFiles.forEach(dataWeaveFile => {
    let context = path.basename(dataWeaveFile);

    let lines = fs
      .readFileSync(dataWeaveFile)
      .toString()
      .split(os.EOL);

    let isCommentedOutLine = false;
    let commonLibraryVariable = null;
    let commonLibraryVariableUseRegEx = null;
    let isCommonLibraryVariableUsed = false;

    lines.forEach(line => {
      if (commentedOutLineRegEx.test(line)) {
        isCommentedOutLine = true;
      } else {
        // Not a comment
        if (!commonLibraryVariable) {
          let match = commonLibraryVariableDeclarationRegEx.exec(line);

          if (match) {
            commonLibraryVariable = match[1];
            commonLibraryVariableUseRegEx = new RegExp(
              `${commonLibraryVariable}\\.valueAs`
            );
          }
        } else {
          // Common library variable has been declared
          if (
            !isCommonLibraryVariableUsed &&
            commonLibraryVariableUseRegEx.test(line)
          ) {
            isCommonLibraryVariableUsed = true;
          }
        }
      }
    });

    assert.isTrue(!isCommentedOutLine, `${context}: commented-out line found`);

    if (commonLibraryVariable) {
      assert.isTrue(
        isCommonLibraryVariableUsed,
        `${context}: common library variable "${commonLibraryVariable}" declared but not used`
      );
    }
  });
};

module.exports = validateDataWeaveFiles;
