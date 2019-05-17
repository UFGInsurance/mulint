const sensitive = require("./sensitive");

describe("isSensitive", () => {
  it.each([
    ["key", "value", false],
    ["key", ";password=secret;", true],
    ["key", ";password = secret;", true],
    ["key", ";password = Replace;", false],
    ["key", ";password = ${placeholder};", false],
    ["pwd", "secret", true],
    ["Password", "secret", true],
    ["Password", "", false],
    ["Password", "Replace", false],
    ["Password", "![secured]", false],
    ["Password", "${placeholder}", false]
  ])(
    "should, for (key '%s', value '%s'), return %p",
    (key, value, expected) => {
      expect(sensitive.isSensitive(key, value)).toBe(expected);
    }
  );
});
