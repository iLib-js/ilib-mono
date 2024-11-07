/*
 * JSXParser.js - Parser for plain Javascript files
 *
 * Copyright © 2023-2024 Box, Inc.
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

import { Parser, IntermediateRepresentation } from 'ilib-lint-common';

/**
 * @class Parser for Javascript files that may contain React JSX elements,
 * based on the the Babel parser. By default, this parser will parse
 * .jsx files. If you put your JSX in a file with a different file name
 * extension, you can use the name "JSXParser" in your filetype parsers array
 * to use this parser.
 */
class JSXParser extends Parser {
    /**
     * Construct a new plugin.
     * @constructor
     */
    constructor(options = {}) {
        super(options);
        this.path = options.filePath;

        this.extensions = [ "jsx" ];
        this.name = "JSXParser";
        this.description = "A parser for React JSX files.";
        if (this.path) {
            this.data = fs.readFileSync(this.path, "utf-8");
        }
    }

    /**
     * @private
     */ 
    parseString(string, sourceFile) {
        return new IntermediateRepresentation({
            type: "babel-ast",
            ir: BabelParser.parse(string, {
                sourceType: "unambiguous",
                plugins: [
                    'jsx'
                ]
            }),
            sourceFile
        });
    }

    /**
     * Parse the current file into an intermediate representation.
     * @param {SourceFile} sourceFile the source file to parse
     * @returns {Array.<IntermediateRepresentation>} the AST representation
     * of the jsx file
     */
    parse(sourceFile) {
        return [this.parseString(sourceFile.getContent(), sourceFile)];
    }

    getExtensions() {
        return this.extensions;
    }
};

export default JSXParser;
