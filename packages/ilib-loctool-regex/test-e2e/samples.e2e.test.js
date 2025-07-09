const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("regex", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "regex");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "xliffs", "sample-regex-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
