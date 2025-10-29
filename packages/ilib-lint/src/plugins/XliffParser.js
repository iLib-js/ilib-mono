/*
 * XliffParser.js - Parser for XLIFF files
 *
 * Copyright © 2022-2025 JEDLSoft
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

import { ResourceXliff, Resource } from 'ilib-tools-common';
import { FileStats, Parser, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';
import { getXliffInfo } from './utils.js';
import XliffFactory from './XliffFactory.js';

/**
 * Count the number of words in the source strings of the resources.
 * This is a very simple word count that splits the source string
 * on whitespace and counts the number of resulting pieces. We can replace it
 * later with a more sophisticated word count if needed.
 *
 * @param {Array.<Resource>} resources the resources to count words in
 * @returns {Number} the total number of words in the source strings
 */
function countSourceWords(resources) {
    return resources.reduce((sum, res) =>
        sum + (res.getSource() ? res.getSource().split(/\s+/).length : 0), 0);
}

/**
 * Count the number of bytes in the source strings of the resources.
 * This is a simple byte count that counts the number of characters in the
 * source string, assuming that each character is one byte. This is not
 * necessarily accurate for all languages, but it is a good enough approximation
 * for most cases. We can replace it later with a more sophisticated byte count
 * if needed.
 *
 * @param {Array.<Resource>} resources the resources to count bytes in
 * @returns {Number} the total number of bytes in the source strings
 */
function countSourceBytes(resources) {
    return resources.reduce((sum, res) =>
        sum + (res.getSource() ? res.getSource().length : 0), 0);
}

/**
 * @class Parser for XLIFF files based on the ilib-xliff library.
 */
class XliffParser extends Parser {
    /**
     * Construct a new plugin.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.extensions = [ "xliff", "xlif", "xlf" ];
        this.name = "xliff";
        this.description = "A parser for xliff files. This can handle xliff v1.2 and v2.0 format files.";
    }

    /**
     * Parse the current file into an intermediate representation.
     * @override
     * @param {SourceFile} sourceFile the file to be parsed
     * @returns {Array.<IntermediateRepresentation>} the intermediate representations of
     * the source file
     */
    parse(sourceFile) {
        const data = sourceFile.getContent();
        const xliffObj = XliffFactory(getXliffInfo(data));

        const xliff = new ResourceXliff({
            path: sourceFile.getPath(),
            xliff: xliffObj
        });

        xliff.parse(data);
        const resources = xliff.getResources() ?? [];
        return [new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            sourceFile,
            stats: new FileStats({
                lines: xliff.getLines(),
                files: 1,
                bytes: countSourceBytes(resources),
                modules: resources.length,
                words: countSourceWords(resources)
            })
        })];
    }

    getType() {
        return "resource";
    }

    getExtensions() {
        return this.extensions;
    }
}

export default XliffParser;
