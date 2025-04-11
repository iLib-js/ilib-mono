/*
 * Transformer - common SPI for a transformer plugin
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
import Results from "./Result.js";

/* @ignore @typedef {import("IntermediateRepresentation")} IntermediateRepresentation */

/**
 * @class common SPI for transformer plugins
 *
 * A transformer is a plugin that takes an intermediate representation of a
 * file and transforms it in some way, and returns a new intermediate
 * representation that is a modified version of the original. For example,
 * a filter transformer might remove some of the entries in the intermediate
 * representation that match a certain pattern, or it might
 * add new entries to the intermediate representation.
 *
 * @abstract
 */
class Transformer extends PipelineElement {
    /**
     * Construct a new transformer instance.
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} [options.getLogger] a callback function provided by
     * @param {object} [options.settings] additional settings that can be passed to
     * the linter to retrieve the log4js logger
     */
    constructor(options) {
        super(options);
        if (this.constructor === Transformer) {
            throw new Error("Cannot instantiate abstract class Transformer directly!");
        }
    }

    /**
     * Transform the given intermediate representation and return a new
     * intermediate representation that is a modified version of the original.
     * Implementations should return a new intermediate representation with the
     * dirty flag set to true if the representation has been modified.
     * Implementations should not modify the original intermediate
     * representation.
     *
     * @abstract
     * @param {IntermediateRepresentation} representation the intermediate
     *   representation to transform
     * @param {Array.<Result>|undefined} results results of linting this @link representation,
     *   or undefined if there are no results yet
     * @returns {IntermediateRepresentation} the new intermediate representation
     *   that is the transformed version of the original
     */
    transform(representation, results) {
        throw new NotImplementedError();
    }
};

export default Transformer;
