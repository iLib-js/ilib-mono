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
import { getXliffInfo } from './utils.js';
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
        if (!ir || ir.getType() !== this.type) {
            throw new Error("Invalid intermediate representation");
        }
        const resources = ir.getRepresentation();
        if (!resources || resources.length === 0) {
            throw new Error("No resources found in intermediate representation");
        }

        // produce the same format as the original file
        const xliffInfo = getXliffInfo(ir.sourceFile.getContent());

        const xliff = new ResourceXliff({
            path: ir.sourceFile.getPath(),
            version: xliffInfo.version,
            style: xliffInfo.style
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
