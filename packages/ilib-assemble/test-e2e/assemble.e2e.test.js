/*
 * assemble.e2e.test.js - E2E tests for ilib-assemble
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from "path";
import fs from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Helper function to run pnpm assemble in a test directory
 */
async function runAssemble(testDir) {
    const testPath = path.resolve(__dirname, testDir);

    try {
        // First install dependencies
        await execFileAsync("pnpm", ["install", "--silent"], {
            cwd: testPath,
            env: { ...process.env },
        });

        // Then run assemble
        const { stdout, stderr } = await execFileAsync("pnpm", ["--silent", "assemble"], {
            cwd: testPath,
            env: { ...process.env },
        });

        return { stdout, stderr, code: 0 };
    } catch (error) {
        return {
            stdout: error.stdout || "",
            stderr: error.stderr || "",
            code: error.code || 1,
        };
    }
}

/**
 * Helper function to read all locale files from a directory
 */
function readLocaleFiles(localeDir) {
    const files = {};
    if (!fs.existsSync(localeDir)) {
        return files;
    }

    const entries = fs.readdirSync(localeDir);
    for (const entry of entries) {
        if (entry.endsWith('.js') || entry.endsWith('.json')) {
            const content = fs.readFileSync(path.join(localeDir, entry), 'utf-8');
            files[entry] = content;
        }
    }
    return files;
}

/**
 * Helper function to clean up locale directory before tests
 */
function cleanLocaleDir(testDir) {
    const localeDir = path.resolve(__dirname, testDir, 'locale');
    if (fs.existsSync(localeDir)) {
        fs.rmSync(localeDir, { recursive: true });
    }
}

describe("ilib-assemble E2E tests", () => {
    describe("Standard ilib module assembly (ilib-istring)", () => {
        const testDir = "../samples/istring-sample";

        beforeAll(async () => {
            cleanLocaleDir(testDir);
        });

        afterAll(async () => {
            cleanLocaleDir(testDir);
        });

        test("assembles locale data from ilib-istring", async () => {
            const result = await runAssemble(testDir);

            expect(result.code).toBe(0);
            expect(result.stderr).toBe("");

            // Read and snapshot the locale files
            const localeDir = path.resolve(__dirname, testDir, "locale");
            const localeFiles = readLocaleFiles(localeDir);

            // Should have created locale files
            expect(Object.keys(localeFiles).length).toBeGreaterThan(0);

            // Snapshot each locale file
            for (const [filename, content] of Object.entries(localeFiles)) {
                expect(content).toMatchSnapshot(filename);
            }
        }, 60000);
    });

    describe("Custom --assemble flag", () => {
        const testDir = "../samples/custom-assemble-sample";

        beforeAll(async () => {
            cleanLocaleDir(testDir);
        });

        afterAll(async () => {
            cleanLocaleDir(testDir);
        });

        test("assembles locale data using custom assemble.mjs", async () => {
            const result = await runAssemble(testDir);

            expect(result.code).toBe(0);
            expect(result.stderr).toBe("");

            // Read and snapshot the locale files
            const localeDir = path.resolve(__dirname, testDir, "locale");
            const localeFiles = readLocaleFiles(localeDir);

            // Should have created locale files
            expect(Object.keys(localeFiles).length).toBeGreaterThan(0);

            // Snapshot each locale file
            for (const [filename, content] of Object.entries(localeFiles)) {
                expect(content).toMatchSnapshot(filename);
            }
        }, 30000);
    });

    describe("Resources assembly (--resources flag)", () => {
        const testDir = "../samples/resources-sample";

        beforeAll(async () => {
            cleanLocaleDir(testDir);
        });

        afterAll(async () => {
            cleanLocaleDir(testDir);
        });

        test("assembles resource files into locale data", async () => {
            const result = await runAssemble(testDir);

            expect(result.code).toBe(0);
            expect(result.stderr).toBe("");

            // Read and snapshot the locale files
            const localeDir = path.resolve(__dirname, testDir, "locale");
            const localeFiles = readLocaleFiles(localeDir);

            // Should have created locale files
            expect(Object.keys(localeFiles).length).toBeGreaterThan(0);

            // Snapshot each locale file
            for (const [filename, content] of Object.entries(localeFiles)) {
                expect(content).toMatchSnapshot(filename);
            }
        }, 30000);
    });

    // Note: legacy-ilib-sample is not tested here because it requires
    // downloading the large legacy ilib package, which is slow and
    // not suitable for automated testing.
});

