# mulint

Mule project linter.

Detects common issues in Mule applications based on [UFG](https://www.ufginsurance.com/) standards.

**Note:** Currently mulint is *very* specific to UFG. We'd like it to be more modular, flexible, configurable, and testable. ([ESLint](https://eslint.org/) is a good example of that.) If you'd like to help, please [contribute](#contribute).

Cross-platform; written in Node.js (JavaScript).

Pronounced *MEW-lint*. :smile_cat:

## Setup

#### Prerequisites

- [Node.js](https://nodejs.org/) 8.10 or later (**LTS**)
    - _(nodejs-lts package for Chocolatey users)_
- [Yarn](https://yarnpkg.com/)

#### Install

1.  Clone the project
2.  CD to the project folder
3.  `yarn`
4.  `yarn link`
5.  On Linux or macOS, `chmod +x mulint.js`

## Use

This is a command-line tool.

`mulint --help` provides usage information.

It will only produce output if there are warnings or errors on the specified _apiBasePath_.

Output may be redirected using shell redirection operators (such as `>`).

## Troubleshooting

If running `mulint` results in a not found or not recognized error, `yarn link` did not work. This could be due to the OS, shell, path, yarn version, etc. The easiest solution is to use `node mulint` instead. If desired you can create a batch file or shell script.

This tool requires node 8.10 or later. If you get a node version error, upgrade to the latest **LTS** (Long Term Support) version of Node.js at https://nodejs.org/ or (if you installed node with Chocolatey) `choco upgrade nodejs-lts`

## Issues

If you encounter false positives or find other checks that could be automated,
please open an [issue](https://github.com/UFGInsurance/mulint/issues).
Include any information (API, branch, file, message, etc.) needed to replicate the issue.

Also please open an issue if the tool behaves incorrectly under macOS, Linux,
or Windows. Include the platform, version, flavor, etc. in addition to the above.

## Contribute

We welcome contributions. Please see [Creating a pull request from a fork](https://help.github.com/articles/creating-a-pull-request-from-a-fork/). We don't have formal guidelines yet, but [these](https://contribute.jquery.org/commits-and-pull-requests/) are a good start.

## License

[MIT](LICENSE.md)

## Disclaimers

MuleSoft:registered:, Anypoint:registered:, CloudHub:tm:, DataWeave:tm:, and RAML:registered: are trademarks or registered trademarks of MuleSoft. Use of them does not imply any affiliation with or endorsement by MuleSoft.

Node.js is a trademark of Joyent, Inc. and is used with its permission. We are not endorsed by or affiliated with Joyent.
