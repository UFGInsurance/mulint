const fs = require("fs");
const xml2js = require("xml2js");
const error = require("./error");
const assert = require("./assert");

const validateLog4j = folderInfo => {
  let contents = fs.readFileSync(folderInfo.log4jFile);
  let parser = new xml2js.Parser();

  parser.parseString(contents, (err, result) => {
    if (err) {
      error.fatal(err);
    }

    let rollingFileAttributes =
      result.Configuration.Appenders[0].RollingFile[0]["$"];

    assert.matches(
      new RegExp(`${folderInfo.apiName}\\.log$`),
      rollingFileAttributes.fileName,
      "Log4j RollingFile fileName"
    );

    assert.matches(
      new RegExp(`${folderInfo.apiName}-%i\\.log$`),
      rollingFileAttributes.filePattern,
      "Log4j RollingFile filePattern"
    );

    let databaseRoute = result.Configuration.Appenders[0].Routing[0].Routes[0].Route.find(
      route => route["$"].key === "DB"
    );

    let apiNameColumn = databaseRoute.JDBC[0].Column.find(
      column => column["$"].name === "API_NAME"
    );

    assert.equals(
      `'${folderInfo.apiName}'`,
      apiNameColumn["$"].literal,
      "Log4 JDBC API_NAME literal"
    );
  });
};

module.exports = validateLog4j;
