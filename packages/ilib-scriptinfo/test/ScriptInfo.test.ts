/*
 * ScriptInfo.test.ts - test the ScriptInfo class
 *
 * Copyright © 2024-2025 JEDLSoft
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

import { scriptInfoFactory, ScriptInfo, ScriptDirection } from '../src/index';

describe('ScriptInfo', () => {
    describe('Constructor and basic functionality', () => {
        test('should create a script info instance with empty string', () => {
            const si = scriptInfoFactory('');
            expect(si).toBeUndefined();
        });

        test('should create a script info instance with valid script code', () => {
            const si = scriptInfoFactory('Latn');
            expect(si).toBeDefined();
            expect(si?.getCode()).toBe('Latn');
        });

        test('should handle undefined script code', () => {
            const si = scriptInfoFactory(undefined);
            expect(si).toBeUndefined();
        });

        test('should handle null script code', () => {
            const si = scriptInfoFactory(null);
            expect(si).toBeUndefined();
        });

        test('should handle numeric script code', () => {
            const si = scriptInfoFactory(123);
            expect(si).toBeUndefined();
        });
    });

    describe('Known script properties', () => {
        test('should get script code number for Latin', () => {
            const si = scriptInfoFactory('Latn');
            expect(si).toBeDefined();
            expect(si?.getCodeNumber()).toBe(215);
        });

        test('should get script name for Latin', () => {
            const si = scriptInfoFactory('Latn');
            expect(si).toBeDefined();
            expect(si?.getName()).toBe('Latin');
        });

        test('should get script long code for Latin', () => {
            const si = scriptInfoFactory('Latn');
            expect(si).toBeDefined();
            expect(si?.getLongCode()).toBe('Latin');
        });

        test('should get script direction for Latin', () => {
            const si = scriptInfoFactory('Latn');
            expect(si).toBeDefined();
            expect(si?.getScriptDirection()).toBe(ScriptDirection.LTR);
        });

        test('should get script casing for Latin', () => {
            const si = scriptInfoFactory('Latn');
            expect(si).toBeDefined();
            expect(si?.getCasing()).toBe(true);
        });

        test('should get script IME requirement for Latin', () => {
            const si = scriptInfoFactory('Latn');
            expect(si).toBeDefined();
            expect(si?.getNeedsIME()).toBe(false);
        });
    });

    describe('RTL script properties', () => {
        test('should handle RTL script direction', () => {
            const si = scriptInfoFactory('Arab');
            expect(si).toBeDefined();
            expect(si?.getScriptDirection()).toBe(ScriptDirection.RTL);
        });

        test('should handle RTL script casing', () => {
            const si = scriptInfoFactory('Arab');
            expect(si).toBeDefined();
            expect(si?.getCasing()).toBe(false);
        });

        test('should handle RTL script IME requirement', () => {
            const si = scriptInfoFactory('Arab');
            expect(si).toBeDefined();
            expect(si?.getNeedsIME()).toBe(false);
        });

        test('should get script properties for Hebrew (RTL)', () => {
            const si = scriptInfoFactory('Hebr');
            expect(si).toBeDefined();
            expect(si?.getCode()).toBe('Hebr');
            expect(si?.getCodeNumber()).toBe(125);
            expect(si?.getName()).toBe('Hebrew');
            expect(si?.getScriptDirection()).toBe(ScriptDirection.RTL);
            expect(si?.getCasing()).toBe(false);
            expect(si?.getNeedsIME()).toBe(false);
        });
    });

    describe('Edge cases and unknown scripts', () => {
        test('should handle completely unknown script code', () => {
            const si = scriptInfoFactory('Xxxx');
            expect(si).toBeUndefined();
        });

        test('should handle empty string script code', () => {
            const si = scriptInfoFactory('');
            expect(si).toBeUndefined();
        });

        test('should handle undefined script code', () => {
            const si = scriptInfoFactory(undefined);
            expect(si).toBeUndefined();
        });

        test('should handle null script code', () => {
            const si = scriptInfoFactory(null);
            expect(si).toBeUndefined();
        });

        test('should handle numeric script code', () => {
            const si = scriptInfoFactory(123);
            expect(si).toBeUndefined();
        });

        test('should handle case-sensitive script codes', () => {
            const si = scriptInfoFactory('latn'); // lowercase
            expect(si).toBeUndefined();
        });

        test('should handle mixed case script codes', () => {
            const si = scriptInfoFactory('LaTn'); // mixed case
            expect(si).toBeUndefined();
        });

        test('should handle script codes with spaces', () => {
            const si = scriptInfoFactory('Lat n'); // with space
            expect(si).toBeUndefined();
        });

        test('should handle script codes with special characters', () => {
            const si = scriptInfoFactory('Lat@n'); // with special char
            expect(si).toBeUndefined();
        });

        test('should handle very long script codes', () => {
            const longCode = 'A'.repeat(100);
            const si = scriptInfoFactory(longCode);
            expect(si).toBeUndefined();
        });

        test('should handle script codes with unicode characters', () => {
            const si = scriptInfoFactory('Lätn'); // with umlaut
            expect(si).toBeUndefined();
        });
    });

    describe('Static methods', () => {
        test('should get all available scripts', () => {
            const allScripts = ScriptInfo.getAllScripts();
            expect(Array.isArray(allScripts)).toBe(true);
            expect(allScripts.length).toBeGreaterThan(0);
            expect(allScripts.includes('Latn')).toBe(true);
            expect(allScripts.includes('Arab')).toBe(true);
        });

        test('should verify all scripts in getAllScripts are valid', () => {
            const allScripts = ScriptInfo.getAllScripts();
            for (const scriptCode of allScripts) {
                const scriptInfo = scriptInfoFactory(scriptCode);
                expect(scriptInfo).toBeDefined();
                expect(scriptInfo?.getCode()).toBe(scriptCode);
                expect(scriptInfo?.getName()).toBeDefined();
                expect(scriptInfo?.getCodeNumber()).toBeDefined();
            }
        });

        test('should verify getAllScripts returns unique values', () => {
            const allScripts = ScriptInfo.getAllScripts();
            const uniqueScripts = new Set(allScripts);
            expect(uniqueScripts.size).toBe(allScripts.length);
        });
    });

    describe('Additional known script tests', () => {
        test('should handle Chinese Han script', () => {
            const si = scriptInfoFactory('Hani');
            expect(si).toBeDefined();
            expect(si?.getName()).toBe('Han (Hanzi, Kanji, Hanja)');
            expect(si?.getNeedsIME()).toBe(true);
        });

        test('should handle Korean Hangul script', () => {
            const si = scriptInfoFactory('Hang');
            expect(si).toBeDefined();
            expect(si?.getName()).toBe('Hangul (Hangŭl, Hangeul)');
            expect(si?.getNeedsIME()).toBe(true);
        });

        test('should handle Japanese Hiragana script', () => {
            const si = scriptInfoFactory('Hira');
            expect(si).toBeDefined();
            expect(si?.getName()).toBe('Hiragana');
            expect(si?.getNeedsIME()).toBe(false);
        });

        test('should handle Thai script', () => {
            const si = scriptInfoFactory('Thai');
            expect(si).toBeDefined();
            expect(si?.getName()).toBe('Thai');
            expect(si?.getCasing()).toBe(false);
        });

        test('should handle Devanagari script', () => {
            const si = scriptInfoFactory('Deva');
            expect(si).toBeDefined();
            expect(si?.getName()).toBe('Devanagari (Nagari)');
            expect(si?.getNeedsIME()).toBe(false);
        });
    });
}); 