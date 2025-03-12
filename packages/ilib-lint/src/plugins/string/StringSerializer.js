/*
 * StringSerializer.js - Serializer for plain text files
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
 * @class Serializer for plain text files that treats the whole file as a
 * simple string.
 */
class StringSerializer extends Serializer {
    /**
     * Construct a new plugin.
     * @constructor
     */
    constructor(options = {}) {
        super(options);

        this.name = "string";
        this.description = "A serializer for plain text file representations that writes the whole file as a simple string.";
        this.type = "string";
    }

    /**
     * Convert the intermediate representation back into a source file.
     *
     * @override
     * @param {IntermediateRepresentation[]} irs the intermediate representations to convert
     * @returns {SourceFile} the source file with the contents of the intermediate
     * representation
     */
    serialize(irs) {
        // should only have 1 intermediate representation in the array because the StringParser
        // only creates one
        const ir = irs[0];
        const data = ir.getRepresentation();
        return new SourceFile(ir.sourceFile.getPath(), {
            file: ir.sourceFile,
            content: data
        });
    }
};

export default StringSerializer;
