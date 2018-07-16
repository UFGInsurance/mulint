const failures = [];

const equals = (expected, actual, context) => {
  if (actual !== expected) {
    failures.push(`${context}: expected ${expected} but was ${actual}`);
  }
};

module.exports = {
  failures,
  equals
};
