/*
 * PythonGnuPlugin.test.js - test the Xliff plugin
 *
 * Copyright © 2023 JEDLSoft
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
import { Parser } from 'i18nlint-common';

import PythonPlugin from '../src/index.js';

describe("testPythonPlugin", () => {
    test("PythonPlugin", () => {
        expect.assertions(1);

        const xp = new PythonPlugin();
        expect(xp).toBeTruthy();
    });

    test("PythonPluginGetParsers", () => {
        expect.assertions(3);

        const xp = new PythonPlugin();
        expect(xp).toBeTruthy();

        const parsers = xp.getParsers();
        expect(parsers).toBeTruthy();
        expect(parsers.length).toBe(0);
    });

    test("PythonPluginGetRules", () => {
        expect.assertions(3);

        const xp = new PythonPlugin();
        expect(xp).toBeTruthy();

        const rules = xp.getRules();
        expect(rules).toBeTruthy();
        expect(rules.length).toBe(3);
    });

    test("PythonPluginGetFormatters", () => {
        expect.assertions(3);

        const xp = new PythonPlugin();
        expect(xp).toBeTruthy();

        const formatters = xp.getFormatters();
        expect(formatters).toBeTruthy();
        expect(formatters.length).toBe(0);
    });
});
