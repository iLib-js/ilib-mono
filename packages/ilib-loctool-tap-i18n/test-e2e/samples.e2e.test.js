const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("tapi18n", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "tap-i18n");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "xliffs", "sample-tapi18n-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
