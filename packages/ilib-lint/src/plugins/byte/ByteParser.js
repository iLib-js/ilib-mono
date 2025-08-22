/*
 * ByteParser.js - Parser that treats the whole file as a sequence of bytes
 *
 * Copyright © 2025 Box, Inc.
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

import { Parser, IntermediateRepresentation, SourceFile } from "ilib-lint-common";

/**
 * Parser that treats the whole file as a sequence of bytes
 */
class ByteParser extends Parser {
    /**
     * @param {ConstructorParameters<typeof Parser>[0]} options options to the constructor
     */
    constructor(options = {}) {
        super(options);

        this.extensions = ["*"]; // can parse any file
        this.name = "byte";
        this.description = "A parser that treats the whole file as a sequence of bytes";
    }

    /**
     * Parse the current file into an intermediate representation.
     *
     * @param {SourceFile} sourceFile the source file to parse
     * @returns {IntermediateRepresentation[]} the intermediate representations
     */
    parse(sourceFile) {
        return [
            new IntermediateRepresentation({
                type: "byte",
                ir: sourceFile.getRaw(),
                sourceFile,
            }),
        ];
    }

    getType() {
        return "byte";
    }

    getExtensions() {
        return this.extensions;
    }
}

export default ByteParser;
