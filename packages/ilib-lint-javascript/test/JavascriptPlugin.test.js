/*
 * JavascriptPlugin.test.js - test the Javascript plugin
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

import JavascriptPlugin from '../src/index.js';

describe("test the javascript plugin", () => {
    test("the javascript plugin loads properly", () => {
        expect.assertions(1);

        const xp = new JavascriptPlugin();
        expect(xp).toBeTruthy();
    });

    test("the javascript plugin get parsers", () => {
        expect.assertions(3);

        const xp = new JavascriptPlugin();
        expect(xp).toBeTruthy();

        const parsers = xp.getParsers();
        expect(parsers).toBeTruthy();
        expect(parsers.length).toBe(0);
    });

    test("the javascript plugin get rules", () => {
        expect.assertions(3);

        const xp = new JavascriptPlugin();
        expect(xp).toBeTruthy();

        const rules = xp.getRules();
        expect(rules).toBeTruthy();
        expect(rules.length).toBe(1);
    });

    test("the javascript plugin get rule sets", () => {
        expect.assertions(3);

        const xp = new JavascriptPlugin();
        expect(xp).toBeTruthy();

        const sets = xp.getRuleSets();
        expect(sets).toBeTruthy();
        expect(Object.keys(sets).length).toBe(1);
    });

    test("the javascript plugin get formatters", () => {
        expect.assertions(3);

        const xp = new JavascriptPlugin();
        expect(xp).toBeTruthy();

        const formatters = xp.getFormatters();
        expect(formatters).toBeTruthy();
        expect(formatters.length).toBe(0);
    });
});
