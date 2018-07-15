const fatal = message => {
  console.error(message);
  process.exit(1);
};

module.exports = {
  fatal
};
