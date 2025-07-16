const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("js", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "js");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-js-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
    describe("regex", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "regex");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "sample-regex-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
