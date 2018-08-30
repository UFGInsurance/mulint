const ignoresDotProjectFile = gitignore => /^\.project\s*$/m.test(gitignore);

const ignoresDotClasspathFile = gitignore =>
  /^\.classpath\s*$/m.test(gitignore);

const CATEGORY = "gitignore";

module.exports = {
  validate({ readFile, folderInfo }, reporter) {
    const gitignore = readFile(folderInfo.gitignoreFile);

    if (!ignoresDotProjectFile(gitignore)) {
      reporter.report({
        category: CATEGORY,
        message: "Not ignoring .project"
      });
    }

    if (!ignoresDotClasspathFile(gitignore)) {
      reporter.report({
        category: CATEGORY,
        message: "Not ignoring .classpath"
      });
    }
  }
};
