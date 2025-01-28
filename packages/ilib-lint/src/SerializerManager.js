/*
 * SerializerManager.js - Factory to create and return the right serializer
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

import { Serializer } from 'ilib-lint-common';

import XliffSerializer from './plugins/XliffSerializer.js';
import LineSerializer from './plugins/LineSerializer.js';

const logger = log4js.getLogger("ilib-lint.SerializerManager");

/**
 * @class Manages a collection of serializers that this instance of ilib-lint
 * knows about.
 */
class SerializerManager {

    /**
     * A cache of serializer classes that this factory knows about.
     * @type {Object.<String, Class>} the cache of serializer classes
     * @private
     */
    serializerCache = {};

    /**
     * A cache of serializer descriptions that this factory knows about.
     * @type {Object.<String, String>} the cache of serializer
     * descriptions
     * @private
     */
    descriptions = {};

    /**
     * A cache of serializer names by type that this factory knows about.
     * @type {Object.<String, Array.<String>>} the cache of serializer names
     * by type
     * @private
     */
    byType = {};

    /**
     * Create a new serializer manager instance.
     * @params {Object} options options controlling the construction of this object
     * @constructor
     */
    constructor(options) {
        this.add([XliffSerializer, LineSerializer]);
        if (options?.serializers) {
            this.add(options.serializers);
        }
    }

    /**
     * Return a serializer instance with the given name for use in
     * formatting the output.
     *
     * @param {String} name name of the serializer to return
     * @param {Object|undefined} options options for this instance of the
     * serializer from the config file, if any
     * @returns {Serializer|undefined} the serializer instance to use, or undefined if
     * the serializer is not found
     */
    get(name, options = undefined) {
        const serializerConfig = this.serializerCache[name];
        if (!serializerConfig) return;

        return serializerConfig ? new serializerConfig({
            ...options,
            getLogger: log4js.getLogger.bind(log4js)
        }) : undefined;
    }

    /**
     * Add a list of serializer classes to this factory so that other code
     * can find them.
     *
     * @param {Array.<Class|Object>} serializers the list of serializer classes
     * or definitions to add
     */
    add(serializers) {
        if (!serializers || !Array.isArray(serializers)) return;
        for (const ser of serializers) {
            let serializer;
            if (ser && typeof(ser) === 'function' && Object.getPrototypeOf(ser).name === "Serializer") {
                serializer = new ser({
                    getLogger: log4js.getLogger.bind(log4js)
                });
                this.serializerCache[serializer.getName()] = ser;
                this.descriptions[serializer.getName()] = serializer.getDescription();
                const type = serializer.getType();
                if (!this.byType[type]) {
                    this.byType[type] = [serializer.getName()];
                } else {
                    this.byType[type].push(serializer.getName());
                }
                logger.trace(`Added programmatic serializer ${serializer.getName()} to the serializer manager`);
            } else {
                logger.debug(`Attempt to add a non-serializer to the serializer manager`);
                if (typeof(serializer?.getName) === 'function') logger.debug(`Name is ${serializer.getName()}`);
            }
        }
    }

    /**
     * Return an array of all known serializer names that handle the given type of
     * of intermediate representation.
     *
     * @returns {Array.<String>} array of serializer names
     */
    getSerializers(type) {
        return this.byType[type] || [];
    }

    /**
     * Return an object where the properties are the serializer names and the
     * values are the serializer descriptions.
     *
     * @returns {Object} the serializer names and descriptions
     */
    getDescriptions() {
        return this.descriptions;
    }

    /**
     * Return how many rules this manager knows about.
     * @returns {Number} the number of rules this manager knows about.
     */
    size() {
        return Object.keys(this.serializerCache).length;
    }

    // for use with the unit tests
    clear() {
        this.serializerCache = {};
    }
}

export default SerializerManager;