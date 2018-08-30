const fs = require("fs");
const assert = require("./assert");

const ignoresDotProjectFile = contents =>
  assert.isTrue(
    /^\.project\s*$/m.test(contents),
    ".gitignore: Not ignoring .project"
  );

const ignoresDotClasspathFile = contents =>
  assert.isTrue(
    /^\.classpath\s*$/m.test(contents),
    ".gitignore: Not ignoring .classpath"
  );

const validateGitignore = folderInfo => {
  const contents = fs.readFileSync(folderInfo.gitignoreFile).toString();

  ignoresDotProjectFile(contents);
  ignoresDotClasspathFile(contents);
};

module.exports = validateGitignore;
