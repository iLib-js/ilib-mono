const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("tap-i18n", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "tap-i18n");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-tap-i18n-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
