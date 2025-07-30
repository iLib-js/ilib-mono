const path = require("path");
const fs = require("fs");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("js-json", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "js-json");
        const xliffPath = path.resolve(projectPath, "sample-js-json-extracted.xliff");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            if (fs.existsSync(xliffPath)) {
                fs.unlinkSync(xliffPath);
            }
        });

        it("should produce an extracted XLIFF file", () => {
            expectFileToMatchSnapshot(xliffPath);
        });
    });

    describe("json", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "json");
        const xliffPath = path.resolve(projectPath, "sample-json-extracted.xliff");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            if (fs.existsSync(xliffPath)) {
                fs.unlinkSync(xliffPath);
            }
        });

        it("should produce an extracted XLIFF file", () => {
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
