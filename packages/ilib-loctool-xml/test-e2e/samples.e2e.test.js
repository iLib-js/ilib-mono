/*
 * samples.e2e.test.js - E2E tests for ilib-loctool-xml samples
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
    describe("xml", () => {
        /** @type {FSSnapshot} */
        let fsSnapshot;
        const projectPath = path.resolve(__dirname, "..", "samples", "xml");
        const xliffPath = path.resolve(projectPath, "sample-xml-extracted.xliff");

        beforeAll(async () => {
            fsSnapshot = FSSnapshot.create(
                [
                    "sample-xml-extracted.xliff",
                    "sample-xml-new-de-DE.xliff",
                    "sample-xml-new-nl-NL.xliff",
                    "xml/res/values-de-rDE",
                    "xml/res/values-nl-rNL",
                    "xml/test_de_DE.properties",
                    "xml/test_nl.properties",
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
