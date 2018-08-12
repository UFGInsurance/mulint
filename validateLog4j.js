const fs = require("fs");
const xml2js = require("xml2js");
const error = require("./error");
const assert = require("./assert");

// eslint-disable-next-line quotes
const expectedRoutingScript = '"${mule.env}".equals("local") ? "local" : "DB";';

const validateTemplateIsCurrent = (xml, databaseRoute) => {
  let routingScript = xml.Configuration.Appenders[0].Routing[0].Script[0][
    "_"
  ].trim();

  assert.equals(expectedRoutingScript, routingScript, "Log4j Routing Script");

  let localRoute = xml.Configuration.Appenders[0].Routing[0].Routes[0].Route.find(
    route => route["$"].key === "local"
  );

  assert.equals("file", localRoute["$"].ref, "Log4j local Route");

  assert.equals(
    "Routing",
    xml.Configuration.Loggers[0].AsyncRoot[0].AppenderRef[0]["$"].ref,
    "Log4j AppenderRef"
  );

  let muleSoftEnvColumn = databaseRoute.JDBC[0].Column.find(
    column => column["$"].name === "MULESOFT_ENV"
  );

  assert.equals(
    "'${mule.env}'",
    muleSoftEnvColumn["$"].literal,
    "Log4 JDBC MULESOFT_ENV literal"
  );
};

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

    validateTemplateIsCurrent(result, databaseRoute);
  });
};

module.exports = validateLog4j;
