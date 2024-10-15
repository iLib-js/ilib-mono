/*
 * Transformer - common SPI for a transformer plugin
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

import IntermediateRepresentation from "./IntermediateRepresentation.js";
import NotImplementedError from "./NotImplementedError.js";

/**
 * @class common SPI for transformer plugins
 *
 * A transformer is a plugin that takes an intermediate representation of a
 * file and transforms it in some way, returning a new intermediate
 * representation that is a modified version of the original. For example,
 * a filter transformer might remove some of the entries in the intermediate
 * representation that match a certain pattern, or a transformer might
 * add new entries to the intermediate representation.
 *
 * @abstract
 */
class Transformer {
    /**
     * Construct a new transformer instance.
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} [options.getLogger] a callback function provided by
     * @param {object} [options.settings] additional settings that can be passed to
     * the linter to retrieve the log4js logger
     */
    constructor(options) {
        if (this.constructor === Transformer) {
            throw new Error("Cannot instantiate abstract class Transformer directly!");
        }
        this.getLogger = options?.getLogger;
    }

    /**
     * Initialize the current plugin.
     */
    init() {}

    /** 
     * Name of this type of transformer
     *
     * Subclass must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass must define this property
    name;

    /**
     * Return the name of this type of transformer.
     * Subclass must define {@link Transformer.name}.
     *
     * @returns {String} return the name of this type of transformer
     */
    getName() {
        return this.name;
    }

    /**
     * Description of what this transformer does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it.
     *
     * Subclass must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass must define this property
    description;

    /**
     * Return a description of what this transformer does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it.
     *
     * Subclass must define {@link Transformer.description}.
     *
     * @returns {String} a description of this transformer.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Type of intermediate representation that this transformer operates
     * upon. The type should be a unique name that matches with
     * the type in the intermediate representation. Typically, a transformer
     * goes along with a particular parser that produces that type of
     * intermediate representation and a set of rules that operate on
     * that same type of representation.
     *
     * The type can be any unique string except that there are three types
     * that are reserved:
     *
     * - resource - the transformer operates on an array of Resource instances as
     *   defined in {@link https://github.com/ilib-js/ilib-tools-common}.
     * - line - the transformer operates on a set of lines as an array of strings
     * - string - the operator works upon the entire contents of
     *   the file as one long string.
     *
     * Subclass must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass must define this property
    type;

    /**
     * Return the type of intermediate representation that this transformer
     * operates upon. The type should be a unique name that matches with
     * the type in the intermediate representation.
     *
     * Subclass must define {@link Transformer.type}.
     *
     * @returns {String} the name of the type of intermediate representation
     * that this transformer operates upon
     */
    getType() {
        return this.type;
    }

    /**
     * Transform the given intermediate representation and return a new
     * intermediate representation that is a modified version of the original.
     *
     * @abstract
     * @param {IntermediateRepresentation} representation the intermediate
     *   representation to transformer
     * @returns {IntermediateRepresentation} the new intermediate representation
     *   that is a subset of the original
     */
    transform(representation) {
        throw new NotImplementedError();
    }
};

export default Transformer;
