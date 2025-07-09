const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("markdown", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "markdown");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-md-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
