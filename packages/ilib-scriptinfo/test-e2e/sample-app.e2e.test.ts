/*
 * sample-app.e2e.test.ts - E2E tests for ilib-scriptinfo sample app
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

import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

interface TestResult {
    stdout: string;
    stderr: string;
    code: number;
}

/**
 * Sample app type
 */
type SampleType = "esm" | "legacy" | "typescript";

/**
 * Helper function to run the sample app with given arguments
 */
async function runSampleApp(args: string[] = [], sampleType: SampleType = "esm"): Promise<TestResult> {
    const sampleDir = path.resolve(__dirname, "..", "samples", sampleType);

    let command: string;
    let commandArgs: string[];

    if (sampleType === "typescript") {
        // For TypeScript, use tsx to run directly
        command = "tsx";
        commandArgs = [path.resolve(sampleDir, "index.ts"), ...args];
    } else {
        // For ESM and Legacy, use node with index.js
        const sampleAppPath = path.resolve(sampleDir, "index.js");
        command = "node";
        commandArgs = [sampleAppPath, ...args];
    }

    try {
        const { stdout, stderr } = await execFileAsync(command, commandArgs, {
            cwd: sampleDir,
            env: { ...process.env, NODE_ENV: "test" }
        });
        return { stdout, stderr, code: 0 };
    } catch (error: any) {
        return {
            stdout: error.stdout || "",
            stderr: error.stderr || "",
            code: error.code || 1
        };
    }
}

/**
 * Test suite for sample apps
 */
describe("ilib-scriptinfo sample apps", () => {
    // Test ESM, Legacy, and TypeScript samples
    const sampleTypes: SampleType[] = ["esm", "legacy", "typescript"];

    describe.each(sampleTypes)(`%s sample app`, (sampleType) => {

            describe("help functionality", () => {

                test("should show help when no arguments provided", async () => {
                    const result = await runSampleApp([], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain("ilib-scriptinfo");
                    expect(result.stdout).toContain("Sample App");
                    expect(result.stdout).toContain("USAGE");
                    expect(result.stdout).toContain("node index.js <script-code>");
                    expect(result.stdout).toContain("EXAMPLES");
                    expect(result.stdout).toContain("node index.js Latn");
                });

                test("should show help when --help flag is provided", async () => {
                    const result = await runSampleApp(["--help"], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain("ilib-scriptinfo");
                    expect(result.stdout).toContain("Sample App");
                    expect(result.stdout).toContain("USAGE");
                    expect(result.stdout).toContain("node index.js <script-code>");
                });

            });

            describe("valid script codes", () => {

                test("should display Latin script information correctly", async () => {
                    const result = await runSampleApp(["Latn"], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain('Script Information for "Latn"');
                    expect(result.stdout).toContain("Code             | Latn");
                    expect(result.stdout).toContain("Code Number      | 215");
                    expect(result.stdout).toContain("Name             | Latin");
                    expect(result.stdout).toContain("Script Direction | 📝 LTR Left-to-Right");
                    expect(result.stdout).toContain("IME Requirement  | ⌨️  No IME required");
                    expect(result.stdout).toContain("Casing Info      | 🔤 Uses letter case");
                });

                test("should display Arabic script information correctly", async () => {
                    const result = await runSampleApp(["Arab"], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain('Script Information for "Arab"');
                    expect(result.stdout).toContain("Code             | Arab");
                    expect(result.stdout).toContain("Name             | Arabic");
                    expect(result.stdout).toContain("Script Direction | 📝 RTL Right-to-Left");
                });

                test("should display Han script information correctly", async () => {
                    const result = await runSampleApp(["Hani"], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain('Script Information for "Hani"');
                    expect(result.stdout).toContain("Code             | Hani");
                    expect(result.stdout).toContain("Name             | Han");
                    expect(result.stdout).toContain("Script Direction | 📝 LTR Left-to-Right");
                });

            });

            describe("case correction functionality", () => {

                test("should correct lowercase input to proper case", async () => {
                    const result = await runSampleApp(["latn"], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain('Script Information for "latn"');
                    expect(result.stdout).toContain("Code             | Latn");
                    expect(result.stdout).toContain("Name             | Latin");
                });

                test("should correct uppercase input to proper case", async () => {
                    const result = await runSampleApp(["LATN"], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain('Script Information for "LATN"');
                    expect(result.stdout).toContain("Code             | Latn");
                    expect(result.stdout).toContain("Name             | Latin");
                });

            });

            describe("partial matching functionality", () => {

                test("should find partial matches for 'lat'", async () => {
                    const result = await runSampleApp(["lat"], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain("❌ Unknown script code: \"lat\"");
                    expect(result.stdout).toContain("🔍 Found");
                    expect(result.stdout).toContain("similar script code(s):");
                    expect(result.stdout).toContain("Latn - Latin");
                });

                test("should find partial matches for 'arab'", async () => {
                    const result = await runSampleApp(["arab"], sampleType);
                    // Both samples find exact match (case-insensitive)
                    expect(result.stdout).toContain('Script Information for "arab"');
                    expect(result.stdout).toContain("Code             | Arab");
                    expect(result.stdout).toContain("Name             | Arabic");
                });

                test("should find partial matches for 'han'", async () => {
                    const result = await runSampleApp(["han"], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain("❌ Unknown script code: \"han\"");
                    expect(result.stdout).toContain("🔍 Found");
                    expect(result.stdout).toContain("similar script code(s):");
                    expect(result.stdout).toContain("Hani - Han");
                });

            });

            describe("error handling", () => {

                test("should handle unknown script code with no matches", async () => {
                    const result = await runSampleApp(["xyzq"], sampleType);
                    expect(result.code).toBe(0);
                    expect(result.stdout).toContain("❌ Unknown script code: \"xyzq\"");
                    expect(result.stdout).toContain("💡 No similar script codes found");
                    expect(result.stdout).toContain("💡 Try one of these valid script codes:");
                    expect(result.stdout).toContain("Arab - Arabic");
                });

                test("should show error for too many arguments", async () => {
                    const result = await runSampleApp(["Latn", "Arab"], sampleType);
                    expect(result.code).toBe(1);
                    expect(result.stderr).toContain("Error: Invalid number of arguments");
                    expect(result.stderr).toContain("Usage: node index.js <script-code>");
                    expect(result.stderr).toContain("Example: node index.js Latn");
                });

            });

        });
    });

});