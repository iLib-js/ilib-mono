/*
 * JSXParser.js - Parser for plain Javascript files
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
 * @class Parser for Javascript files based on the acorn library.
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
        this.name = "jsx";
        this.description = "A parser for React JSX files.";
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

export default JSXParser;
