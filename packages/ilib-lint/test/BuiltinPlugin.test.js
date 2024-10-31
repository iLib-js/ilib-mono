/*
 * BuiltinPlugin.test.js - test the built-in plugin
 *
 * Copyright © 2022-2024 JEDLSoft
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

import BuiltinPlugin from '../src/plugins/BuiltinPlugin.js';
import { Parser, SourceFile } from 'ilib-lint-common';

describe("testBuiltinPlugin", () => {
    test("BuiltinPlugin", () => {
        expect.assertions(1);

        const xp = new BuiltinPlugin();
        expect(xp).toBeTruthy();
    });

    test("BuiltinPluginGetExtensions", () => {
        expect.assertions(3);

        const xp = new BuiltinPlugin();
        expect(xp).toBeTruthy();

        const parsers = xp.getParsers();
        expect(parsers.length).toBe(3);

        const xliff = new parsers[0]();
        expect(xliff.getExtensions()).toEqual(["xliff", "xlif", "xlf"]);
    });

    test("BuiltinPluginGetParser", () => {
        expect.assertions(3);

        const xp = new BuiltinPlugin();
        expect(xp).toBeTruthy();

        const parsers = xp.getParsers();
        expect(parsers).toBeTruthy();
        expect(parsers.length).toBe(3);
    });

    test("XliffParser", () => {
        expect.assertions(4);

        const xp = new BuiltinPlugin();
        expect(xp).toBeTruthy();

        const parsers = xp.getParsers();
        expect(parsers).toBeTruthy();

        const XliffParser = parsers[0];

        const parser = new XliffParser();
        expect(parser).toBeTruthy();
        expect(parser instanceof Parser).toBeTruthy();
    });

    test("XliffParserGetResources", () => {
        expect.assertions(5);

        const xp = new BuiltinPlugin();
        expect(xp).toBeTruthy();

        const parsers = xp.getParsers();
        expect(parsers).toBeTruthy();

        const XliffParser = parsers[0];

        const parser = new XliffParser();
        expect(parser).toBeTruthy();
        const ir = parser.parse(new SourceFile("./test/testfiles/xliff/test.xliff", {}));

        const resources = ir[0].getRepresentation();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);
    });

    test("XliffParserGetResourcesRight", () => {
        expect.assertions(12);

        const xp = new BuiltinPlugin();
        expect(xp).toBeTruthy();

        const parsers = xp.getParsers();
        expect(parsers).toBeTruthy();

        const XliffParser = parsers[0];

        const parser = new XliffParser();
        expect(parser).toBeTruthy();
        const ir = parser.parse(new SourceFile("./test/testfiles/xliff/test.xliff", {}));

        const resources = ir[0].getRepresentation();
        expect(resources).toBeTruthy();

        expect(resources[0].source).toBe("Asdf asdf");
        expect(resources[0].sourceLocale).toBe("en-US");
        expect(resources[0].target).toBe("foobarfoo");
        expect(resources[0].targetLocale).toBe("de-DE");
        expect(resources[0].reskey).toBe("foobar");
        expect(resources[0].datatype).toBe("plaintext");
        expect(resources[0].comment).toBe("foobar is where it's at!");
        expect(resources[0].pathName).toBe("foo/bar/asdf.java");
    });
});
