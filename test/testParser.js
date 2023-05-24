/*
 * testParser.js - test the parser superclass object
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

export const testParser = {
    testParserNormal: function(test) {
        test.expect(1);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        test.ok(parser);

        test.done();
    },

    testParserCannotInstantiateAbstractClass: function(test) {
        test.expect(1);

        test.throws(() => {
            new Parser();
        });

        test.done();
    },

    testParserGetName: function(test) {
        test.expect(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        test.ok(parser);

        test.equal(parser.getName(), "mock");

        test.done();
    },

    testParserGetDescription: function(test) {
        test.expect(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        test.ok(parser);

        test.equal(parser.getDescription(), "A mock parser that doesn't really do a whole heck of a lot of anything.");

        test.done();
    },

    testParserGetExtensions: function(test) {
        test.expect(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        test.ok(parser);

        test.equalIgnoringOrder(parser.getExtensions(), [ "x", "y", "z" ]);

        test.done();
    },

    testParserGetType: function(test) {
        test.expect(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        test.ok(parser);

        test.equal(parser.getType(), "ast");

        test.done();
    },

    testParserGetCanWrite: function(test) {
        test.expect(2);

        const parser = new MockParser({
            filePath: "a/b/c.x"
        });

        test.ok(parser);

        test.equal(parser.canWrite, false);

        test.done();
    },
};

