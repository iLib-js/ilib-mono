const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("slack", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "slack");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-slack-json-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
