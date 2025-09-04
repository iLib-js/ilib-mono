/*
 * ByteSerializer.js - Serializer for byte files
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

import { Serializer, IntermediateRepresentation, SourceFile } from "ilib-lint-common";

/**
 * @class Serializer for byte files that treats the whole file as a
 * Buffer.
 */
class ByteSerializer extends Serializer {
    /**
     * Construct a new plugin.
     * @constructor
     */
    constructor(options = {}) {
        super(options);

        this.name = "byte";
        this.type = "byte";
        this.description = "A serializer for byte file representations that writes the whole file as a Buffer.";
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
        // should only have 1 intermediate representation in the array because the ByteParser
        // only creates one
        const ir = irs[0];
        const data = ir.getRepresentation();
        return new SourceFile(ir.sourceFile.getPath(), {
            file: ir.sourceFile,
            raw: data,
        });
    }
}

export default ByteSerializer;
