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

import ScriptInfo, { ScriptDirection } from '../src/index';

describe('ScriptInfo', () => {
    describe('Constructor and basic functionality', () => {
        test('should create a script info instance with empty string', () => {
            const si = new ScriptInfo('');
            expect(si).not.toBeNull();
            expect(si.getCode()).toBe('');
        });

        test('should create a script info instance with valid script code', () => {
            const si = new ScriptInfo('Latn');
            expect(si).not.toBeNull();
            expect(si.getCode()).toBe('Latn');
        });

        test('should handle undefined script code', () => {
            const si = new ScriptInfo(undefined as any);
            expect(si).not.toBeNull();
            expect(si.getCode()).toBe(undefined as any);
        });

        test('should handle null script code', () => {
            const si = new ScriptInfo(null as any);
            expect(si).not.toBeNull();
            expect(si.getCode()).toBe(null as any);
        });

        test('should handle numeric script code', () => {
            const si = new ScriptInfo(123 as any);
            expect(si).not.toBeNull();
            expect(si.getCode()).toBe(123 as any);
        });
    });

    describe('Known script properties', () => {
        test('should get script code number for Latin', () => {
            const si = new ScriptInfo('Latn');
            expect(si.getCodeNumber()).toBe(215);
        });

        test('should get script name for Latin', () => {
            const si = new ScriptInfo('Latn');
            expect(si.getName()).toBe('Latin');
        });

        test('should get script long code for Latin', () => {
            const si = new ScriptInfo('Latn');
            expect(si.getLongCode()).toBe('Latin');
        });

        test('should get script direction for Latin', () => {
            const si = new ScriptInfo('Latn');
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
        });

        test('should get script casing for Latin', () => {
            const si = new ScriptInfo('Latn');
            expect(si.getCasing()).toBe(true);
        });

        test('should get script IME requirement for Latin', () => {
            const si = new ScriptInfo('Latn');
            expect(si.getNeedsIME()).toBe(false);
        });
    });

    describe('RTL script properties', () => {
        test('should handle RTL script direction', () => {
            const si = new ScriptInfo('Arab');
            expect(si.getScriptDirection()).toBe(ScriptDirection.RTL);
        });

        test('should handle RTL script casing', () => {
            const si = new ScriptInfo('Arab');
            expect(si.getCasing()).toBe(false);
        });

        test('should handle RTL script IME requirement', () => {
            const si = new ScriptInfo('Arab');
            expect(si.getNeedsIME()).toBe(false);
        });

        test('should get script properties for Hebrew (RTL)', () => {
            const si = new ScriptInfo('Hebr');
            expect(si.getCode()).toBe('Hebr');
            expect(si.getCodeNumber()).toBe(125);
            expect(si.getName()).toBe('Hebrew');
            expect(si.getScriptDirection()).toBe(ScriptDirection.RTL);
            expect(si.getCasing()).toBe(false);
            expect(si.getNeedsIME()).toBe(false);
        });
    });

    describe('Edge cases and unknown scripts', () => {
        test('should handle completely unknown script code', () => {
            const si = new ScriptInfo('Xxxx');
            expect(si.getCode()).toBe('Xxxx');
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(false);
            expect(si.getCasing()).toBe(false);
        });

        test('should handle empty string script code', () => {
            const si = new ScriptInfo('');
            expect(si.getCode()).toBe('');
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(false);
            expect(si.getCasing()).toBe(false);
        });

        test('should handle undefined script code', () => {
            const si = new ScriptInfo(undefined as any);
            expect(si.getCode()).toBe(undefined as any);
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(false);
            expect(si.getCasing()).toBe(false);
        });

        test('should handle null script code', () => {
            const si = new ScriptInfo(null as any);
            expect(si.getCode()).toBe(null as any);
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(false);
            expect(si.getCasing()).toBe(false);
        });

        test('should handle numeric script code', () => {
            const si = new ScriptInfo(123 as any);
            expect(si.getCode()).toBe(123 as any);
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(false);
            expect(si.getCasing()).toBe(false);
        });

        test('should handle case-sensitive script codes', () => {
            const si = new ScriptInfo('latn'); // lowercase
            expect(si.getCode()).toBe('latn');
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
        });

        test('should handle mixed case script codes', () => {
            const si = new ScriptInfo('LaTn'); // mixed case
            expect(si.getCode()).toBe('LaTn');
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
        });

        test('should handle script codes with spaces', () => {
            const si = new ScriptInfo('Lat n'); // with space
            expect(si.getCode()).toBe('Lat n');
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
        });

        test('should handle script codes with special characters', () => {
            const si = new ScriptInfo('Lat@n'); // with special char
            expect(si.getCode()).toBe('Lat@n');
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
        });

        test('should handle very long script codes', () => {
            const longCode = 'A'.repeat(100);
            const si = new ScriptInfo(longCode);
            expect(si.getCode()).toBe(longCode);
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
        });

        test('should handle script codes with unicode characters', () => {
            const si = new ScriptInfo('Lätn'); // with umlaut
            expect(si.getCode()).toBe('Lätn');
            expect(si.getCodeNumber()).toBeUndefined();
            expect(si.getName()).toBeUndefined();
            expect(si.getLongCode()).toBeUndefined();
        });
    });

    describe('Static methods', () => {
        test('should get all available scripts', () => {
            const scripts = ScriptInfo.getAllScripts();
            expect(scripts).not.toBeNull();
            expect(Array.isArray(scripts)).toBe(true);
            expect(scripts.length).toBe(226);
            expect(scripts[0]).toBe('Adlm');
            expect(scripts[1]).toBe('Afak');
            expect(scripts[2]).toBe('Aghb');
        });

        test('should verify all scripts in getAllScripts are valid', () => {
            const scripts = ScriptInfo.getAllScripts();
            
            // Check that all returned scripts are strings
            scripts.forEach(script => {
                expect(typeof script).toBe('string');
                expect(script.length).toBeGreaterThan(0);
            });

            // Check that some known scripts are included
            expect(scripts.includes('Latn')).toBe(true);
            expect(scripts.includes('Arab')).toBe(true);
            expect(scripts.includes('Hani')).toBe(true);
            expect(scripts.includes('Hang')).toBe(true);
        });

        test('should verify getAllScripts returns unique values', () => {
            const scripts = ScriptInfo.getAllScripts();
            const uniqueScripts = new Set(scripts);
            expect(uniqueScripts.size).toBe(scripts.length);
        });
    });

    describe('Additional known script tests', () => {
        test('should handle Chinese Han script', () => {
            const si = new ScriptInfo('Hani');
            expect(si.getCode()).toBe('Hani');
            expect(si.getCodeNumber()).toBe(500);
            expect(si.getName()).toBe('Han (Hanzi, Kanji, Hanja)');
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(true);
            expect(si.getCasing()).toBe(false);
        });

        test('should handle Korean Hangul script', () => {
            const si = new ScriptInfo('Hang');
            expect(si.getCode()).toBe('Hang');
            expect(si.getCodeNumber()).toBe(286);
            expect(si.getName()).toBe('Hangul (Hangŭl, Hangeul)');
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(true);
            expect(si.getCasing()).toBe(false);
        });

        test('should handle Japanese Hiragana script', () => {
            const si = new ScriptInfo('Hira');
            expect(si.getCode()).toBe('Hira');
            expect(si.getCodeNumber()).toBe(410);
            expect(si.getName()).toBe('Hiragana');
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(false);
            expect(si.getCasing()).toBe(false);
        });

        test('should handle Thai script', () => {
            const si = new ScriptInfo('Thai');
            expect(si.getCode()).toBe('Thai');
            expect(si.getCodeNumber()).toBe(352);
            expect(si.getName()).toBe('Thai');
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(false);
            expect(si.getCasing()).toBe(false);
        });

        test('should handle Devanagari script', () => {
            const si = new ScriptInfo('Deva');
            expect(si.getCode()).toBe('Deva');
            expect(si.getCodeNumber()).toBe(315);
            expect(si.getName()).toBe('Devanagari (Nagari)');
            expect(si.getScriptDirection()).toBe(ScriptDirection.LTR);
            expect(si.getNeedsIME()).toBe(false);
            expect(si.getCasing()).toBe(false);
        });
    });
}); 