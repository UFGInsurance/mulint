module.exports = {
  printSummary(problems) {
    if (problems.length === 0) {
      console.log("No problems found");
      return;
    }

    problems.map(problem => console.log(`[warning]  ${problem}`));
    console.log();

    // Currently this only handles summarizing warnings. Errors are considered
    // fatal and handled separately, hence hard-coding 0 errors.
    console.log(
      `${problems.length} problems found (0 errors, ${
        problems.length
      } warnings)`
    );
  }
};
