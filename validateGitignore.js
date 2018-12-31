const assert = require("./assert");

const validateGitignore = contents => {
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
