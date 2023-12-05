/*
 * TSXParser.js
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

import fs from "fs";
import BabelParser from "@babel/parser";
import { Parser, IntermediateRepresentation } from "i18nlint-common";

/** @class Parser For Javascript files based on the acorn library. */
class TSXParser extends Parser {
    /** @readonly */
    name = "tsx";

    /** @readonly */
    description = "A parser for Typescript files (with React support).";

    /** @readonly */
    extensions = ["ts", "tsx"];

    /** @readonly */
    type = "babel-ast";

    /** @override */
    parse() {
        if (!this.filePath) {
            throw new Error(`Cannot parse because filePath is not set`);
        }
        const content = fs.readFileSync(this.filePath, "utf-8");
        const parsed = BabelParser.parse(content, {
            plugins: ["typescript", "jsx"],
            sourceType: "unambiguous"
        });

        return [
            new IntermediateRepresentation({
                type: this.type,
                filePath: this.filePath,
                ir: parsed
            })
        ];
    }
}

export default TSXParser;
