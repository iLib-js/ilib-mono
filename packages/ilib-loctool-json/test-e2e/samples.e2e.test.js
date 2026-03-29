/*
 * samples.e2e.test.js - E2E tests for ilib-loctool-json samples
 *
 * Copyright © 2025, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require("fs");
const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner, FSSnapshot } = require("ilib-internal");

describe("samples", () => {
    describe("js-json", () => {
        /** @type {FSSnapshot} */
        let fsSnapshot;
        const projectPath = path.resolve(__dirname, "..", "samples", "js-json");
        const xliffExtractedPath = path.resolve(projectPath, "sample-js-json-extracted.xliff");
        const xliffNewDePath = path.resolve(projectPath, "sample-js-json-new-de-DE.xliff");
        const xliffNewKoPath = path.resolve(projectPath, "sample-js-json-new-ko-KR.xliff");

        beforeAll(async () => {
            fsSnapshot = FSSnapshot.create(
                [
                    "sample-js-json-extracted.xliff",
                    "sample-js-json-new-de-DE.xliff",
                    "sample-js-json-new-ko-KR.xliff",
                    "resources",
                ].map((p) => path.resolve(projectPath, p))
            );
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            fsSnapshot.restore();
        });

        it("should produce an extracted XLIFF file", () => {
            expectFileToMatchSnapshot(xliffExtractedPath);
        });

        it("should produce a new XLIFF file for de-DE", () => {
            expectFileToMatchSnapshot(xliffNewDePath);
        });

        it("should produce a new XLIFF file for ko-KR", () => {
            expectFileToMatchSnapshot(xliffNewKoPath);
        });
    });

    describe("json", () => {
        /** @type {FSSnapshot} */
        let fsSnapshot;
        const projectPath = path.resolve(__dirname, "..", "samples", "json");
        const xliffExtractedPath = path.resolve(projectPath, "sample-json-extracted.xliff");
        const xliffNewDePath = path.resolve(projectPath, "sample-json-new-de-DE.xliff");
        const xliffNewKoPath = path.resolve(projectPath, "sample-json-new-ko-KR.xliff");

        beforeAll(async () => {
            fsSnapshot = FSSnapshot.create(
                [
                    "sample-json-extracted.xliff",
                    "sample-json-new-de-DE.xliff",
                    "sample-json-new-ko-KR.xliff",
                    "i18n/de-DE.json",
                    "i18n/ko-KR.json",
                ].map((p) => path.resolve(projectPath, p))
            );
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            fsSnapshot.restore();
        });

        it("should produce an extracted XLIFF file", () => {
            expectFileToMatchSnapshot(xliffExtractedPath);
        });

        it("should produce a new XLIFF file for de-DE", () => {
            expectFileToMatchSnapshot(xliffNewDePath);
        });

        it("should produce a new XLIFF file for ko-KR", () => {
            expectFileToMatchSnapshot(xliffNewKoPath);
        });
    });

    describe("json-resources", () => {
        /** @type {FSSnapshot} */
        let fsSnapshot;
        const projectPath = path.resolve(__dirname, "..", "samples", "json-resources");
        const xliffExtractedPath = path.resolve(projectPath, "sample-json-resources-extracted.xliff");
        const xliffNewDePath = path.resolve(projectPath, "sample-json-resources-new-de-DE.xliff");
        const xliffNewKoPath = path.resolve(projectPath, "sample-json-resources-new-ko-KR.xliff");

        beforeAll(async () => {
            fsSnapshot = FSSnapshot.create(
                [
                    "sample-json-resources-extracted.xliff",
                    "resources",
                ].map((p) => path.resolve(projectPath, p))
            );
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            fsSnapshot.restore();
        });

        it("should produce an extracted XLIFF file with only source tags", () => {
            expectFileToMatchSnapshot(xliffExtractedPath);
        });

        it("should not produce a new XLIFF file for de-DE", () => {
            expect(fs.existsSync(xliffNewDePath)).toBe(false);
        });

        it("should not produce a new XLIFF file for ko-KR", () => {
            expect(fs.existsSync(xliffNewKoPath)).toBe(false);
        });
    });
});
