# mulint

Mule project linter.

Detects common issues in Mule applications based on UFG standards.

Cross-platform; written in Node.js (JavaScript).

## Setup

1.  Clone the project
2.  CD to the project folder
3.  `yarn`
4.  `yarn link`

## Use

This is a command-line tool.

`mulint --help` provides usage information.

Do not include a trailing backslash in the path argument. There is a [bug](https://github.com/nodejs/node/issues/21854) in Node.

## Issues

If you encounter false positives or find other checks that could be automated,
please open an [issue](https://github.com/UFGInsurance/mulint/issues).
Include any information (API, branch, file, message, etc.) needed to replicate the issue.

Also please open an issue if the tool behaves incorrectly under macOS, Linux,
or Windows. Include the platform, version, flavor, etc. in addition to the above.
