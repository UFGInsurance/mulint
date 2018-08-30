const fs = require("fs");

const readFile = fileInfo => fs.readFileSync(fileInfo).toString();

const create = (folderInfo, pom) => ({
  folderInfo,
  pom,
  readFile
});

module.exports = {
  create
};
