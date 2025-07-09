const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("po", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "po");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "xliffs", "sample-po-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
