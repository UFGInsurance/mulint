const xmlParser = require("./xmlParser");
const error = require("./error");
const assert = require("./assert");

const validateLog4j = folderInfo => {
  let { xml } = xmlParser(folderInfo.log4jFile);

  let appenders = xml.Configuration.Appenders;

  if (!appenders) {
    error.fatal("Log4j Appenders not found");
  }

  let rollingFileAppender = appenders[0].RollingFile;

  if (!rollingFileAppender) {
    error.fatal("Log4j RollingFile appender not found");
  }

  let rollingFileAttributes = rollingFileAppender[0]["$"];

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
};

module.exports = validateLog4j;
