const fs = require("fs");

const folderParser = apiBasePath => {
  if (!fs.existsSync(apiBasePath)) {
    console.error(`apiBasePath "${apiBasePath}" not found`);
    process.exit(1);
  }

  return {
    apiBasePath: apiBasePath
  };
};

module.exports = folderParser;
