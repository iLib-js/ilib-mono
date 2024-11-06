/*
 * XliffSerializer.js - Serializer for XLIFF files
 *
 * Copyright © 2024 JEDLSoft
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

import { ResourceXliff } from 'ilib-tools-common';
import { Serializer, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

/**
 * @class Serializer for XLIFF files based on the ilib-xliff library.
 */
class XliffSerializer extends Serializer {
    /**
     * Construct a new plugin.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "xliff";
        this.description = "A serializer for xliff files. This can handle xliff v1.2 and v2.0 format files.";
        this.type = "resource";
    }

    /**
     * Convert the intermediate representation back into a source file.
     *
     * @override
     * @param {IntermediateRepresentation} ir the intermediate representation to convert
     * @returns {SourceFile} the source file with the contents of the intermediate
     * representation
     */
    serialize(ir) {
        const resources = ir.getRepresentation();
        const xliff = new ResourceXliff({
            path: ir.sourceFile.getPath()
        });
        resources.forEach(resource => {
            xliff.addResource(resource);
        });
        const data = xliff.getText();
        return new SourceFile(ir.sourceFile.getPath(), {
            file: ir.sourceFile,
            content: data
        });
    }
}

export default XliffSerializer;
