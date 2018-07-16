const failures = [];

const equals = (expected, actual, context) => {
  if (actual !== expected) {
    failures.push(`${context}: expected ${expected} but was ${actual}`);
  }
};

const matches = (regex, actual, context) => {
  if (!regex.test(actual)) {
    failures.push(`${context}: expected matching ${regex} but was ${actual}`);
  }
};

module.exports = {
  failures,
  equals,
  matches
};
