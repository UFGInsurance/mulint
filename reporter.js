const chalk = require("chalk");

const problems = [];

module.exports = {
  report(problem) {
    problems.push(problem);
  },
  printSummary() {
    problems.map(problem =>
      console.log(
        `${chalk.red("error")}  ${chalk.grey(problem.category)}  ${
          problem.message
        }`
      )
    );

    if (problems.length > 0) {
      console.log();
      console.log(chalk.redBright(`${problems.length} problems found`));
    } else {
      console.log(`${chalk.greenBright("No problems found!")}`);
    }
  }
};
