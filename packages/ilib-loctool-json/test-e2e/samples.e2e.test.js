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

const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner, FSSnapshot } = require("ilib-internal");

describe("samples", () => {
    describe("js-json", () => {
        /** @type {FSSnapshot} */
        let fsSnapshot;
        const projectPath = path.resolve(__dirname, "..", "samples", "js-json");
        const xliffPath = path.resolve(projectPath, "sample-js-json-extracted.xliff");

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
            expectFileToMatchSnapshot(xliffPath);
        });
    });

    describe("json", () => {
        /** @type {FSSnapshot} */
        let fsSnapshot;
        const projectPath = path.resolve(__dirname, "..", "samples", "json");
        const xliffPath = path.resolve(projectPath, "sample-json-extracted.xliff");

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
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
