const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("salesforce", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "salesforce");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-metaxml-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
