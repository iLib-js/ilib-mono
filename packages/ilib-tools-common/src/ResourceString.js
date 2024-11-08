/*
 * ResourceString.js - represents an string in a resource file
 *
 * Copyright © 2022-2023 JEDLSoft
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

import Resource from "./Resource.js";
import { cleanString } from "./utils.js";
import log4js from "@log4js-node/log4js-api";

const logger = log4js.getLogger("tools-common.ResourceString");

/**
 * @class Represents a string resource from a resource file or
 * extracted from the code.

 * @extends Resource
 */
class ResourceString extends Resource {
    /**
     * Construct a new ResourceString instance. The props may contain any
     * of properties from the Resource constructor and additionally,
     * these properties:
     *
     * <ul>
     * <li>source {String} - the source string associated with this key
     * </ul>
     *
     * @constructor
     * @param {Object} props properties of the string, as defined above
     */
    constructor(props) {
        super(props);

        if (props) {
            this.source = typeof(props.source) === 'string' ? props.source : props.text;
            this.target = props.target;
        }

        this.origin = this.origin || "source";
        this.datatype = this.datatype || "plaintext";
        this.resType = ResourceString.resClass;
        this.sourceLocale = this.sourceLocale || this.project && this.project.sourceLocale || "en-US";
    }

    /**
     * Set the source string written in the source
     * locale of this resource string.
     *
     * @param {String} str the source string
     */
    setSource(str) {
        if (typeof(str) !== 'string') return;
        this.source = str;
        this.dirty = true;
    }

    /**
     * Set the target string of this resource.
     *
     * @param {String} str the target string
     */
    setTarget(str) {
        if (typeof(str) !== 'string') return;
        this.target = str;
        this.dirty = true;
    }

    /**
     * Return the number of strings in this resource.
     *
     * @returns {number} the number of strings in this resource
     */
    size() {
        return 1;
    }

    /**
     * Clone this resource and override the properties with the given ones.
     *
     * @params {Object|undefined} overrides optional properties to override in
     * the cloned object
     * @returns {ResourceArray} a clone of this resource
     */
    clone(overrides) {
        const r = new ResourceString(this);
        if (overrides) {
            for (let p in overrides) {
                r[p] = overrides[p];
            }
        }
        return r;
    }

    /**
     * Return true if the other resource contains the exact same resource as
     * the current one. All fields must match.
     *
     * @param {Resource} other another resource to test against the current one
     * @returns {boolean} true if these represent the same resource, false otherwise
     */
    equals(other) {
        if (!other || !this.same(other)) return false;

        return this.source === other.source;
    }

    /**
     * Calculate a resource key string for this class of resource given the
     * parameters.
     *
     * @param {String} project the project of the string
     * @param {String} locale the locale of the string
     * @param {String} reskey the key of the string
     * @param {String} datatype the datatype of the string
     * @param {String} flavor the flavor of the string
     * @param {String} context the context of the string
     * @static
     * @return {String} a hash key
     */
    static hashKey(project, locale, reskey, datatype, flavor, context) {
        const key = ["rs", project, locale, reskey, datatype, flavor, context].join("_");
        logger.trace("Hashkey is " + key);
        return key;
    }

    /**
     * Calculate a resource key string for this class of resource given the
     * parameters.
     *
     * @param {String} project the project of the string
     * @param {String} locale the locale of the string
     * @param {String} reskey the key of the string
     * @param {String} datatype the datatype of the string
     * @param {String} flavor the flavor of the string
     * @param {String} context the context of the string
     * @static
     * @return {String} a hash key
     */
    static cleanHashKey(project, locale, reskey, datatype, flavor, context) {
        const cleaned = reskey && reskey.replace(/\s+/g, " ").trim() || "";
        const key = ["rs", project, locale, cleaned, datatype, flavor, context].join("_");
        logger.trace("CleanHashkey is " + key);
        return key;
    }

    /**
     * Return the a hash key that uniquely identifies this resource.
     *
     *  @return {String} a unique hash key for this resource
     */
    hashKey() {
        const locale = this.targetLocale || this.getSourceLocale();
        return ResourceString.hashKey(this.project, locale, this.reskey, this.datatype, this.flavor, this.context);
    }

    /**
     * Return the a hash key that uniquely identifies the translation of
     * this resource to the given locale.
     *
     * @param {String} locale a locale spec of the desired translation
     * @return {String} a unique hash key for this resource
     */
    hashKeyForTranslation(locale) {
        return ResourceString.hashKey(this.project, locale, this.reskey, this.datatype, this.flavor, this.context);
    }

    /**
     * Return the a hash key that uniquely identifies this resource, but cleaned
     *
     *  @return {String} a unique hash key for this resource, but cleaned
     */
    cleanHashKey() {
        const locale = this.targetLocale || this.getSourceLocale();
        return ResourceString.cleanHashKey(this.project, locale, this.reskey, this.datatype, this.flavor, this.context);
    }

    /**
     * Return the a hash key that uniquely identifies the translation of
     * this resource to the given locale, but cleaned
     *
     * @param {String} locale a locale spec of the desired translation
     * @return {String} a unique hash key for this resource's string
     */
    cleanHashKeyForTranslation(locale) {
        return ResourceString.cleanHashKey(this.project, locale, this.reskey, this.datatype, this.flavor, this.context);
    }

    /**
     * Check if the given resource is an instance of the current
     * resource.
     *
     * @override
     * @param {Resource} a resource to check
     * @returns {boolean} true if this is an instance of
     * the current resource, false otherwise.
     */
    isInstance(resource) {
        if (!super.isInstance(resource)) {
            return false;
        }

        // now check the properties specific to this resource subclass
        return cleanString(this.source) === cleanString(resource.source);
    }
}

/**
 * The class of this kind of string resource.
 *
 * @static
 * @const
 */
ResourceString.resClass = "string";


export default ResourceString;
