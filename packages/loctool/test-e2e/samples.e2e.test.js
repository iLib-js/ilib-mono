/*
 * samples.e2e.test.js - E2E tests for loctool samples
 *
 * Copyright © 2026 JEDLSoft
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
    describe("webos-js", () => {
        /** @type {FSSnapshot} */
        let fsSnapshot;
        const projectPath = path.resolve(__dirname, "..", "samples", "webos-js");
        const xliffPath = path.resolve(projectPath, "sample-webos-js-extracted.xliff");
        const newKoXliffPath = path.resolve(projectPath, "sample-webos-js-new-ko-KR.xliff");
        const newDeXliffPath = path.resolve(projectPath, "sample-webos-js-new-de-DE.xliff");
        const koResourcePath = path.resolve(projectPath, "resources", "ko", "strings.json");
        const deResourcePath = path.resolve(projectPath, "resources", "de", "strings.json");

        beforeAll(async () => {
            fsSnapshot = FSSnapshot.create(
                [
                    "sample-webos-js-extracted.xliff",
                    "sample-webos-js-new-de-DE.xliff",
                    "sample-webos-js-new-ko-KR.xliff",
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
            expectFileToMatchSnapshot(xliffPath);
        });

        it("should produce a new-strings XLIFF file for ko-KR", () => {
            expectFileToMatchSnapshot(newKoXliffPath);
        });

        it("should produce a new-strings XLIFF file for de-DE", () => {
            expectFileToMatchSnapshot(newDeXliffPath);
        });

        it("should produce localized ko-KR resources", () => {
            expectFileToMatchSnapshot(koResourcePath);
        });

        it("should produce localized de-DE resources", () => {
            expectFileToMatchSnapshot(deResourcePath);
        });
    });

    describe("webos-dart", () => {
        /** @type {FSSnapshot} */
        let fsSnapshot;
        const projectPath = path.resolve(__dirname, "..", "samples", "webos-dart");
        const xliffPath = path.resolve(projectPath, "sample-webos-dart-extracted.xliff");
        const newKoXliffPath = path.resolve(projectPath, "sample-webos-dart-new-ko-KR.xliff");
        const newDeXliffPath = path.resolve(projectPath, "sample-webos-dart-new-de-DE.xliff");
        const koResourcePath = path.resolve(projectPath, "assets", "i18n", "ko.json");
        const deResourcePath = path.resolve(projectPath, "assets", "i18n", "de.json");

        beforeAll(async () => {
            fsSnapshot = FSSnapshot.create(
                [
                    "sample-webos-dart-extracted.xliff",
                    "sample-webos-dart-new-de-DE.xliff",
                    "sample-webos-dart-new-ko-KR.xliff",
                    "assets",
                ].map((p) => path.resolve(projectPath, p))
            );
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            fsSnapshot.restore();
        });

        it("should not produce an extracted XLIFF file since localizeOnly is set", () => {
            expect(fs.existsSync(xliffPath)).toBe(false);
        });

        it("should not produce a new-strings XLIFF file for ko-KR since localizeOnly is set", () => {
            expect(fs.existsSync(newKoXliffPath)).toBe(false);
        });

        it("should not produce a new-strings XLIFF file for de-DE since localizeOnly is set", () => {
            expect(fs.existsSync(newDeXliffPath)).toBe(false);
        });

        it("should produce localized ko-KR resources", () => {
            expectFileToMatchSnapshot(koResourcePath);
        });

        it("should produce localized de-DE resources", () => {
            expectFileToMatchSnapshot(deResourcePath);
        });
    });
});
