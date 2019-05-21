const failures = [];

const equals = (expected, actual, context) => {
  if (actual !== expected) {
    failures.push(`${context}: expected "${expected}" but was "${actual}"`);
  }
};

const matches = (regex, actual, context) => {
  if (!regex.test(actual)) {
    failures.push(`${context}: expected matching ${regex} but was "${actual}"`);
  }
};

const isTrue = (expression, message) => {
  if (!expression) {
    failures.push(message);
  }
};

const fail = message => failures.push(message);

// For tests - do not want to change reference
const clearFailures = () => {
  failures.length = 0;
};

module.exports = {
  failures,
  equals,
  matches,
  isTrue,
  fail,
  clearFailures
};
