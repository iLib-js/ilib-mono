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
import { xml2js } from 'xml-js';

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
     * @returns {SourceFile|undefined} the source file with the contents of the intermediate
     * representation, or undefined if the source file could not be created
     */
    serialize(irs) {
        // should only be one ir in this array
        if (!irs || irs.length === 0) {
            return undefined;
        }
        const ir = irs[0];
        if (!ir || ir.getType() !== this.type) {
            return undefined;
        }
        const resources = ir.getRepresentation();
        if (!resources || resources.length === 0) {
            return undefined;
        }
        // produce the same version as the original file
        const xliffVersion = this._getxliffVersion(ir.sourceFile.getContent());
        const xliff = new ResourceXliff({
            path: ir.sourceFile.getPath(),
            version: xliffVersion
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

    /**
    * Extracts the XLIFF version from the provided data.
    *
    * @param {String} data The XML data as a string.
    * @returns {String} The XLIFF version extracted from the XML data,
    * or the default version "1.2" if the version is not found or an error occurs.
    */
    _getxliffVersion(data) {
        const defaultVersion = "1.2";
        if (!data) defaultVersion;

        try {
            const parseData = xml2js(data);
            return parseData?.elements?.[0]?.attributes?.version || defaultVersion;
        } catch (e) {
            // If an error occurs during XML parsing, return the default version.
            return defaultVersion;
        }
    }
}

export default XliffSerializer;
