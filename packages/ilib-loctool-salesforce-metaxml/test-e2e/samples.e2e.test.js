const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("arb", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "arb");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "arb-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });
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
