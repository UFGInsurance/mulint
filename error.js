const fatal = message => {
  console.error(`[error]  ${message}`);
  console.log();

  // Fatal errors cause process to exit so we can hard-code the fact that it's
  // 1 problem, 1 error, and 0 warnings
  console.log("1 problem found (1 error, 0 warnings)");

  process.exit(1);
};

module.exports = {
  fatal
};
