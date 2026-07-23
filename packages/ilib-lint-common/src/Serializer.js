/*
 * Serializer.js - common SPI for serializer plugins
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

import NotImplementedError from "./NotImplementedError.js";
import PipelineElement from "./PipelineElement.js";

/* @ignore @typedef {import("IntermediateRepresentation.js")} IntermediateRepresentation */
/* @ignore @typedef {import("SourceFile.js")} SourceFile */

/**
 * @class common SPI for serializer plugins
 *
 * A serializer converts an IntermediateRepresentation into a SourceFile instance
 * that can be written back to disk. For example, an xliff serializer can take
 * an array of Resource instances and convert it into xliff file format and set
 * that as the content of the SourceFile it produces.
 *
 * @abstract
 */
class Serializer extends PipelineElement {
    /**
     * Construct a new serializer instance.
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} [options.getLogger] a callback function provided by the linter
     * to retrieve the log4js logger
     * @param {object} [options.settings] additional settings that can be passed to the serializer
     * implementation
     */
    constructor(options) {
        super(options);
        if (this.constructor === Serializer) {
            throw new Error("Cannot instantiate abstract class Plugin directly!");
        }
    }

    /**
     * Serialize the given intermediate representation into a SourceFile instance. The
     * intermediate representation is an object that represents the parsed
     * form of the file. The serializer converts this object into a SourceFile
     * that can be written back to disk. For example, an xliff serializer can take
     * an intermediate representation that is an array of Resource instances and
     * convert it into xliff file format and set that as the content of the SourceFile
     * it produces.
     *
     * The type of the intermediate representation that this serializer can handle
     * is specified in the `type` property of this instance passed to the constructor.
     * The linter will only allow this serializer to be used for intermediate
     * representations of that type so they must match. The source file that is
     * returned must have the same type as the intermediate representation.
     *
     * @abstract
     * @param {IntermediateRepresentation[]} representations the array of intermediate
     * representations to serialize
     * @returns {SourceFile} the source file that contains the serialized form of the
     * given intermediate representation
     * @throws {Error} if the source file could not be created
     */
    serialize(representations) {
        throw new NotImplementedError();
    }
};

export default Serializer;
