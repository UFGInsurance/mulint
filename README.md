# mulint

Mule project linter.

Detects common issues in Mule applications based on UFG standards.

Cross-platform; written in Node.js (JavaScript).

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
    - On Linux or macOS, `chmod +x mulint.js` should replace this step.

## Use

This is a command-line tool.

`mulint --help` provides usage information.

## Troubleshooting

If running `mulint` results in a not found or not recognized error, `yarn link` did not work. This could be due to the OS, shell, path, yarn version, etc. The easiest solution is to use `node mulint` instead. If desired you can create a batch file or shell script.

This tool requires node 8.10 or later. If you get a node version error, upgrade to the latest **LTS** (Long Term Support) version of Node.js at https://nodejs.org/en/ or (if you installed node with Chocolatey) `choco upgrade nodejs-lts`

## Issues

If you encounter false positives or find other checks that could be automated,
please open an [issue](https://github.com/UFGInsurance/mulint/issues).
Include any information (API, branch, file, message, etc.) needed to replicate the issue.

Also please open an issue if the tool behaves incorrectly under macOS, Linux,
or Windows. Include the platform, version, flavor, etc. in addition to the above.
