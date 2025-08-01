/*
 * samples.e2e.test.js - E2E tests for ilib-loctool-javascript samples
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
const fs = require("fs");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {
    describe("js", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "js");
        const xliffPath = path.resolve(projectPath, "sample-js-extracted.xliff");

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

    describe("php-resource", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "php-resource");
        const xliffPath = path.resolve(projectPath, "sample-php-resource-extracted.xliff");

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
