/*
 * Parser.test.js - test the parser superclass object
 *
 * Copyright © 2022-2023 JEDLSoft
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

import Parser from '../src/Parser.js';

class MockParser extends Parser {
    constructor() {
        super();
        this.name = "mock";
        this.extensions = [ "x", "y", "z" ];
        this.description = "A mock parser that doesn't really do a whole heck of a lot of anything.";
    }

    getType() {
        return "ast";
    }
}

describe("testParser", () => {
    test("ParserNormal", () => {
        expect.assertions(1);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        expect(parser).toBeTruthy();
    });

    test("ParserCannotInstantiateAbstractClass", () => {
        expect.assertions(1);

        expect(() => {
            new Parser();
        }).toThrow();
    });

    test("ParserGetName", () => {
        expect.assertions(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        expect(parser).toBeTruthy();

        expect(parser.getName()).toBe("mock");
    });

    test("ParserGetDescription", () => {
        expect.assertions(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        expect(parser).toBeTruthy();

        expect(parser.getDescription()).toBe("A mock parser that doesn't really do a whole heck of a lot of anything.");
    });

    test("ParserGetExtensions", () => {
        expect.assertions(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        expect(parser).toBeTruthy();

        expect(parser.getExtensions()).toEqual([ "x", "y", "z" ]);
    });

    test("ParserGetType", () => {
        expect.assertions(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        expect(parser).toBeTruthy();

        expect(parser.getType()).toBe("ast");
    });

    test("ParserGetCanWrite", () => {
        expect.assertions(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        expect(parser).toBeTruthy();

        expect(parser.canWrite).toBe(false);
    });
});

