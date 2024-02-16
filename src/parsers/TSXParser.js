/*
 * TSXParser.js
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

import fs from "fs";
import BabelParser from "@babel/parser";
import { Parser, IntermediateRepresentation } from "i18nlint-common";

/** @class Parser For Typescript files based on the Babel parser.
 * This parser can parse any Typescript file with or without React
 * JSX elements in it. By default, this parser will parse .ts and
 * .tsx files. If you put your typescript in a file with a different
 * file name extension, you can use the name "TSXParser" in your
 * filetype parsers array to use this parser.
*/
class TSXParser extends Parser {
    /** @readonly */
    name = "TSXParser";

    /** @readonly */
    description = "A parser for Typescript files (with React support).";

    /** @readonly */
    extensions = ["ts", "tsx"];

    /** @readonly */
    type = "babel-ast";

    /**
     * Construct a new plugin.
     * @constructor
     */
    constructor(options = {}) {
        super(options);
        this.filePath = options.filePath;
    }

    /**
     * @private
     */
    parseString(content, path) {
        return new IntermediateRepresentation({
            type: this.type,
            ir: BabelParser.parse(content, {
                plugins: ["typescript", "jsx"],
                sourceType: "unambiguous"
            }),
            filePath: path
        });
    }

    /** @override */
    parse() {
        if (!this.filePath) {
            throw new Error(`Cannot parse because filePath is not set`);
        }
        const content = fs.readFileSync(this.filePath, "utf-8");
        return [this.parseString(content, this.filePath)];
    }
}

export default TSXParser;
