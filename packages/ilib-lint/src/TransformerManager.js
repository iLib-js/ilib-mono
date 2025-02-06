/*
 * TransformerManager.js - Factory to create and return the right transformer
 *
 * Copyright © 2025 JEDLSoft
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

import log4js from 'log4js';

import { Transformer } from 'ilib-lint-common';

import ErrorFilterTransformer from './plugins/ErrorFilterTransformer.js';

const logger = log4js.getLogger("ilib-lint.TransformerManager");

/**
 * @class Manages a collection of transformers that this instance of ilib-lint
 * knows about.
 */
class TransformerManager {

    /**
     * A cache of transformer classes that this factory knows about.
     * @type {Object.<String, Class>} the cache of transformer classes
     * @private
     */
    transformerCache = {};

    /**
     * A cache of transformer descriptions that this factory knows about.
     * @type {Object.<String, String>} the cache of transformer
     * descriptions
     * @private
     */
    descriptions = {};

    /**
     * A cache of transformer names by type that this factory knows about.
     * @type {Object.<String, Array.<String>>} the cache of transformer names
     * by type
     * @private
     */
    byType = {};

    /**
     * Create a new transformer manager instance.
     * @params {Object} options options controlling the construction of this object
     * @constructor
     */
    constructor(options) {
        this.add([ErrorFilterTransformer]);
        if (options?.transformers) {
            this.add(options.transformers);
        }
    }

    /**
     * Return a transformer instance with the given name for use in
     * formatting the output.
     *
     * @param {String} name name of the transformer to return
     * @param {Object|undefined} options options for this instance of the
     * transformer from the config file, if any
     * @returns {Transformer|undefined} the transformer instance to use, or undefined if
     * the transformer is not found
     */
    get(name, options = undefined) {
        const transformerConfig = this.transformerCache[name];
        if (!transformerConfig || typeof(transformerConfig) !== 'function') return;

        return transformerConfig ? new transformerConfig({
            ...options,
            getLogger: log4js.getLogger.bind(log4js)
        }) : undefined;
    }

    /**
     * Add a list of transformer classes to this factory so that other code
     * can find them.
     *
     * @param {Array.<Class|Object>} transformers the list of transformer classes
     * or definitions to add
     */
    add(transformers) {
        if (!transformers || !Array.isArray(transformers)) return;
        for (const transformerClass of transformers) {
            let transformer;
            if (transformerClass && typeof(transformerClass) === 'function' && Object.getPrototypeOf(transformerClass).name === "Transformer") {
                transformer = new transformerClass({
                    getLogger: log4js.getLogger.bind(log4js)
                });
                this.transformerCache[transformer.getName()] = transformerClass;
                this.descriptions[transformer.getName()] = transformer.getDescription();
                const type = transformer.getType();
                if (!this.byType[type]) {
                    this.byType[type] = [transformer.getName()];
                } else {
                    this.byType[type].push(transformer.getName());
                }
                logger.trace(`Added programmatic transformer ${transformer.getName()} to the transformer manager`);
            } else {
                logger.debug(`Attempt to add a non-transformer to the transformer manager`);
                if (typeof(transformer?.getName) === 'function') logger.debug(`Name is ${transformer.getName()}`);
            }
        }
    }

    /**
     * Return an array of all known transformer names that handle the given type of
     * of intermediate representation.
     *
     * @returns {Array.<String>} array of transformer names
     */
    getTransformers(type) {
        return this.byType[type] || [];
    }

    /**
     * Return an object where the properties are the transformer names and the
     * values are the transformer descriptions.
     *
     * @returns {Object} the transformer names and descriptions
     */
    getDescriptions() {
        return this.descriptions;
    }

    /**
     * Return how many rules this manager knows about.
     * @returns {Number} the number of rules this manager knows about.
     */
    size() {
        return Object.keys(this.transformerCache).length;
    }

    // for use with the unit tests
    clear() {
        this.transformerCache = {};
    }
}

export default TransformerManager;