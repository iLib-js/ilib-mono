const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("js-json", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "js-json");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-js-json-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
