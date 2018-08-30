const chalk = require("chalk");

const fatal = message => {
  console.error(`${chalk.red("error")}  ${message}`);
  process.exit(1);
};

module.exports = {
  fatal
};
