const fs = require("fs");
const xml2js = require("xml2js");
const error = require("./error");
const util = require("util");

const validateApiFiles = folderInfo => {
  folderInfo.apiFiles.forEach(apiFile => {
    let contents = fs.readFileSync(apiFile);
    let parser = new xml2js.Parser();

    parser.parseString(contents, (err, result) => {
      if (err) {
        error.fatal(err);
      }
      console.log(util.inspect(result, false, null));
    });
  });
};

module.exports = validateApiFiles;
