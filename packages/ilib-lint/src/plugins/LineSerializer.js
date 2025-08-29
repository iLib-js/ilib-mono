/*
 * LineSerializer.js - Serializer for plain text files
 *
 * Copyright © 2024-2025 JEDLSoft
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

import { Serializer, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

/**
 * @class Serializer for plain text files that splits them by lines
 */
class LineSerializer extends Serializer {
    /**
     * Construct a new plugin.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "line";
        this.description = "A serializer for plain text files that joins an array of lines into a file with newlines.";
        this.type = "line";
    }

    /**
     * Convert the intermediate representation back into a source file.
     *
     * @override
     * @param {IntermediateRepresentation[]} irs the intermediate representations to convert
     * @returns {SourceFile} the source file with the contents of the intermediate
     * representation
     * @throws {Error} if the source file could not be created
     */
    serialize(irs) {
        // should only be one ir in this array
        if (!irs || irs.length === 0) {
            throw new Error("No intermediate representation provided");
        }
        const ir = irs[0];
        if (ir.getType() !== this.type) {
            throw new Error("Invalid intermediate representation");
        }
        const lines = ir.getRepresentation();
        if (!lines || lines.length === 0) {
            throw new Error("No lines found in intermediate representation");
        }
        const data = lines.join("\n");
        return new SourceFile(ir.sourceFile.getPath(), {
            file: ir.sourceFile,
            content: data
        });
    }
};

export default LineSerializer;
