const fs = require("fs");
const assert = require("./assert");

const validateGitignore = folderInfo => {
  let contents = fs.readFileSync(folderInfo.gitignoreFile).toString();

  assert.isTrue(
    /^\.project\s*$/m.test(contents),
    ".gitignore: Not ignoring .project"
  );

  assert.isTrue(
    /^\.classpath\s*$/m.test(contents),
    ".gitignore: Not ignoring .classpath"
  );
};

module.exports = validateGitignore;
