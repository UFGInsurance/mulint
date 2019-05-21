const validateApiFile = require("./validateApiFile");
const assert = require("./assert");
const xml2js = require("xml2js");

const valid = `<?xml version="1.0" encoding="UTF-8"?>
<mule >
	<apikit:config name="api-config" raml="api.raml" consoleEnabled="false" doc:name="Router" />
	<flow name="api-main">
		<http:listener config-ref="standardHTTPS" path="/api/foo/v1/*" doc:name="HTTP" />
		<apikit:router config-ref="api-config" doc:name="APIkit Router" />
		<exception-strategy ref="ChoiceExceptionStrategy" doc:name="Reference Exception Strategy" />
	</flow>
	<flow name="api-console">
		<http:listener config-ref="standardHTTPS" path="\${api.basepath}" doc:name="HTTP" />
		<apikit:console config-ref="api-config" doc:name="APIkit Console" />
        <exception-strategy ref="ChoiceExceptionStrategy" doc:name="Reference Exception Strategy"/>
	</flow>
	<flow name="get:/foo:api-config">
		<flow-ref name="getSubflow" doc:name="Call getSubflow" />
        <exception-strategy ref="ChoiceExceptionStrategy" doc:name="Reference Exception Strategy"/>
	</flow>
</mule>`;

const invalidListener = `<?xml version="1.0" encoding="UTF-8"?>
<mule >
	<apikit:config name="api-config" raml="api.raml" consoleEnabled="false" doc:name="Router" />
	<flow name="api-main">
		<http:listener config-ref="standardHTTPS" path="/bad/foo/v1/*" doc:name="HTTP" />
		<apikit:router config-ref="api-config" doc:name="APIkit Router" />
		<exception-strategy ref="ChoiceExceptionStrategy" doc:name="Reference Exception Strategy" />
	</flow>
	<flow name="api-console">
		<http:listener config-ref="standardHTTPS" path="\${api.basepath}" doc:name="HTTP" />
		<apikit:console config-ref="api-config" doc:name="APIkit Console" />
        <exception-strategy ref="ChoiceExceptionStrategy" doc:name="Reference Exception Strategy"/>
	</flow>
	<flow name="get:/foo:api-config">
		<flow-ref name="getSubflow" doc:name="Call getSubflow" />
        <exception-strategy ref="ChoiceExceptionStrategy" doc:name="Reference Exception Strategy"/>
	</flow>
</mule>`;

describe("validateApiFile", () => {
  beforeEach(() => {
    assert.clearFailures();
  });

  afterEach(() => {
    assert.clearFailures();
  });

  it("should pass on a valid file", () => {
    let parser = new xml2js.Parser();
    let xml;
    let pomInfo = { isOnPrem: true };

    parser.parseString(valid, (_, result) => {
      xml = result;
    });

    validateApiFile("api.xml", xml, pomInfo);

    expect(assert.failures).toEqual([]);
  });

  it("should fail on invalid http:listener path", () => {
    let parser = new xml2js.Parser();
    let xml;
    let pomInfo = { isOnPrem: true };

    parser.parseString(invalidListener, (_, result) => {
      xml = result;
    });

    validateApiFile("api.xml", xml, pomInfo);

    expect(assert.failures.length).toBe(1);
    expect(assert.failures[0]).toMatch("http:listener path");
  });
});
