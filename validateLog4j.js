const xmlParser = require("./xmlParser");
const assert = require("./assert");

const validateLog4j = folderInfo => {
  let { xml } = xmlParser(folderInfo.log4jFile);

  let rollingFileAttributes =
    xml.Configuration.Appenders[0].RollingFile[0]["$"];

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
