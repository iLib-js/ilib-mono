/*
 * FlowParser.js - Parser for plain Javascript files using flow type
 * definitions
 *
 * Copyright © 2023 Box, Inc.
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
import BabelParser from "@babel/parser";

import { Parser, IntermediateRepresentation } from 'i18nlint-common';

/**
 * @class Parser for Javascript files based on the Babel parser. This
 * parser can parse Javascript with flow types and with React JSX
 * elements. It can also parse regular Javascript with flow without
 * any React JSX in it. By default, this parser will parse .js and
 * .jsx files. If you put your javascript with flow in a file with a
 * different file name extension, you can use the name "FlowParser"
 * in your filetype parsers array to use this parser.
 */
class FlowParser extends Parser {
    /**
     * Construct a new plugin.
     * @constructor
     */
    constructor(options = {}) {
        super(options);
        this.path = options.filePath;

        this.extensions = [ "js", "jsx" ];
        this.name = "FlowParser";
        this.description = "A parser for JS and JSX files with flow type definitions.";
        if (this.path) {
            this.data = fs.readFileSync(this.path, "utf-8");
        }
    }

    /**
     * @private
     */
    parseString(string, path) {
        return new IntermediateRepresentation({
            type: "babel-ast",
            ir: BabelParser.parse(string, {
                sourceType: "unambiguous",
                plugins: [
                    'flow',
                    'jsx'
                ]
            }),
            filePath: path
        });
    }

    /**
     * Parse the current file into an intermediate representation.
     * @returns {Array.<IntermediateRepresentation>} the AST representation
     * of the jsx file
     */
    parse() {
        return [this.parseString(this.data, this.path)];
    }

    getExtensions() {
        return this.extensions;
    }
};

export default FlowParser;
