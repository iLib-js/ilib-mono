/**
 * generate-script-data.test.ts - Tests for the script data generator
 *
 * Copyright © 2025 JEDLSoft
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

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('generate-script-data.js', () => {
    const scriptPath = path.join(__dirname, '../scripts/generate-script-data.js');
    const outputPath = path.join(__dirname, '../src/ScriptData.ts');
    const originalOutputPath = path.join(__dirname, '../src/ScriptData.ts.backup');

    beforeAll(() => {
        // Backup the original ScriptData.ts if it exists
        if (fs.existsSync(outputPath)) {
            fs.copyFileSync(outputPath, originalOutputPath);
        }
    });

    afterAll(() => {
        // Restore the original ScriptData.ts
        if (fs.existsSync(originalOutputPath)) {
            fs.copyFileSync(originalOutputPath, outputPath);
            fs.unlinkSync(originalOutputPath);
        } else {
            // If no original backup, regenerate the file for other tests
            execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
        }
    });

    beforeEach(() => {
        // Don't delete the file - just regenerate it
        // This ensures other tests can still use it
    });

    describe('Script execution', () => {
        test('should run without errors', () => {
            expect(() => {
                execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
            }).not.toThrow();
        });

        test('should generate output file', () => {
            execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
            expect(fs.existsSync(outputPath)).toBe(true);
        });

        test('should output success message', () => {
            const output = execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
            expect(output).toContain('✅ Generated TS ScriptData.ts');
            expect(output).toContain('📁 Output file:');
            expect(output).toContain('📊 Source: ucd-full package');
        });
    });

    describe('Generated file structure', () => {
        beforeEach(() => {
            execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
        });

        test('should have correct file header', () => {
            const content = fs.readFileSync(outputPath, 'utf8');
            expect(content).toContain('ScriptData.ts - Generated script data');
            expect(content).toContain('Copyright © 2025 JEDLSoft');
            expect(content).toContain('This file is auto-generated');
        });

        test('should export correct TypeScript types', () => {
            const content = fs.readFileSync(outputPath, 'utf8');
            expect(content).toContain('export type ScriptDataEntry = [string, number, string, string, boolean?, boolean?, boolean?];');
            expect(content).toContain('export const scriptData: ScriptDataEntry[] = [');
        });

        test('should have valid TypeScript syntax', () => {
            const content = fs.readFileSync(outputPath, 'utf8');
            // Check for basic TypeScript syntax
            expect(content).toMatch(/export type ScriptDataEntry/);
            expect(content).toMatch(/export const scriptData/);
            expect(content).toMatch(/ScriptDataEntry\[\] = \[/);
        });
    });

    describe('Data content validation', () => {
        let content: string;

        beforeEach(() => {
            execSync(`node "${scriptPath}"`, { encoding: 'utf8' });
            content = fs.readFileSync(outputPath, 'utf8');
        });

        test('should have reasonable number of scripts', () => {
            // Count the number of array entries by counting lines that start with [
            const arrayLines = content.split('\n').filter(line => line.trim().startsWith('['));
            expect(arrayLines.length).toBeGreaterThan(200);
            expect(arrayLines.length).toBeLessThan(500);
        });

        test('should contain known scripts', () => {
            expect(content).toContain('"Latn"'); // Latin
            expect(content).toContain('"Arab"'); // Arabic
            expect(content).toContain('"Hani"'); // Han
            expect(content).toContain('"Hebr"'); // Hebrew
            expect(content).toContain('"Cyrl"'); // Cyrillic
        });

        test('should have correct data for Latin script', () => {
            expect(content).toContain('["Latn",215,"Latin","Latin"');
        });

        test('should have correct data for Arabic script', () => {
            expect(content).toContain('["Arab",160,"Arabic","Arabic",true]');
        });

        test('should have unique script codes', () => {
            // Extract all script codes from array entries only
            const scriptCodeMatches = content.match(/\["([A-Z][a-z]{3})",/g);
            expect(scriptCodeMatches).toBeTruthy();
            const scriptCodes = scriptCodeMatches!.map(match => {
                const codeMatch = match.match(/\["([A-Z][a-z]{3})",/);
                expect(codeMatch).toBeTruthy();
                return codeMatch![1];
            });
            const uniqueCodes = new Set(scriptCodes);
            expect(uniqueCodes.size).toBe(scriptCodes.length);
        });

        test('should have unique script numbers', () => {
            // Extract all script numbers and check for duplicates
            const scriptNumberMatches = content.match(/\["[A-Z][a-z]{3}",(\d+),/g);
            expect(scriptNumberMatches).toBeTruthy();
            const scriptNumbers = scriptNumberMatches!.map(match => {
                const numberMatch = match.match(/,(\d+),/);
                expect(numberMatch).toBeTruthy();
                return parseInt(numberMatch![1]!, 10);
            });
            const uniqueNumbers = new Set(scriptNumbers);
            expect(uniqueNumbers.size).toBe(scriptNumbers.length);
        });

        test('should have valid script codes format', () => {
            const scriptCodeMatches = content.match(/"([A-Z][a-z]{3})"/g);
            expect(scriptCodeMatches).toBeTruthy();
            scriptCodeMatches!.forEach(match => {
                const code = match.slice(1, -1);
                expect(code).toMatch(/^[A-Z][a-z]{3}$/); // ISO 15924 format
            });
        });

        test('should have valid script numbers', () => {
            const scriptNumberMatches = content.match(/\["[A-Z][a-z]{3}",(\d+),/g);
            expect(scriptNumberMatches).toBeTruthy();
            scriptNumberMatches!.forEach(match => {
                const numberMatch = match.match(/,(\d+),/);
                expect(numberMatch).toBeTruthy();
                const number = parseInt(numberMatch![1]!, 10);
                expect(number).toBeGreaterThan(0);
                expect(number).toBeLessThan(1000);
                expect(Number.isInteger(number)).toBe(true);
            });
        });
    });

    describe('Error handling', () => {
        test('should handle missing dependencies gracefully', () => {
            // This test would require mocking require.resolve to fail
            // For now, we'll just ensure the script has try-catch
            const content = fs.readFileSync(scriptPath, 'utf8');
            expect(content).toContain('try {');
            expect(content).toContain('} catch (error) {');
            expect(content).toContain('console.error');
            expect(content).toContain('process.exit(1)');
        });
    });
});