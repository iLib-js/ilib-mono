/*
 * testscriptinfo.js - test the ScriptInfo class
 *
 * Copyright © 2013-2017, 2019-2022, 2024-2025 JEDLSoft
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

import { ScriptInfo } from '../src/index.js';

describe('ScriptInfo', () => {
    test('should create a script info instance', () => {
        const si = new ScriptInfo();
        expect(si).not.toBeNull();
    });

    test('should create a script info instance with script code', () => {
        const si = new ScriptInfo('Latn');
        expect(si).not.toBeNull();
        expect(si.getCode()).toBe('Latn');
    });

    test('should get script code number', () => {
        const si = new ScriptInfo('Latn');
        expect(si.getCodeNumber()).toBe(215);
    });

    test('should get script name', () => {
        const si = new ScriptInfo('Latn');
        expect(si.getName()).toBe('Latin');
    });

    test('should get script long code', () => {
        const si = new ScriptInfo('Latn');
        expect(si.getLongCode()).toBe('Latin');
    });

    test('should get script direction', () => {
        const si = new ScriptInfo('Latn');
        expect(si.getScriptDirection()).toBe('ltr');
    });

    test('should get script casing', () => {
        const si = new ScriptInfo('Latn');
        expect(si.getCasing()).toBe(true);
    });

    test('should get script IME requirement', () => {
        const si = new ScriptInfo('Latn');
        expect(si.getNeedsIME()).toBe(false);
    });

    test('should handle RTL script direction', () => {
        const si = new ScriptInfo('Arab');
        expect(si.getScriptDirection()).toBe('rtl');
    });

    test('should handle RTL script casing', () => {
        const si = new ScriptInfo('Arab');
        expect(si.getCasing()).toBe(false);
    });

    test('should handle RTL script IME requirement', () => {
        const si = new ScriptInfo('Arab');
        expect(si.getNeedsIME()).toBe(false);
    });

    test('should handle unknown script correctly', () => {
        const si = new ScriptInfo('Xxxx');
        expect(si.getCode()).toBe('Xxxx');
        expect(si.getCodeNumber()).toBeUndefined();
        expect(si.getName()).toBeUndefined();
        expect(si.getLongCode()).toBeUndefined();
        expect(si.getScriptDirection()).toBe('ltr');
        expect(si.getNeedsIME()).toBe(false);
        expect(si.getCasing()).toBe(false);
    });

    test('should get all available scripts', () => {
        const scripts = ScriptInfo.getAllScripts();
        expect(scripts).not.toBeNull();
        expect(scripts.length).toBe(226);
        expect(scripts[0]).toBe('Adlm');
        expect(scripts[1]).toBe('Afak');
        expect(scripts[2]).toBe('Aghb');
    });
}); 