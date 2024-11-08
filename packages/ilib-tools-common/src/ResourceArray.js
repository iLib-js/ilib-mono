/*
 * ResourceArray.js - represents an array of strings in a resource file
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

const logger = log4js.getLogger("tools-common.ResourceArray");

/**
 * @class A class that models a resource that is an array of strings.
 *
 * @extends Resource
 */
class ResourceArray extends Resource {
    /**
     * Construct a new ResourceArray instance.
     *
     * Arrays of strings are used in Android apps, as well as some other
     * places, to specify things like the values for a drop-down box in
     * a UI.<p>
     *
     * The properties in the props parameter may be any of the following:
     *
     * <ul>
     * <li><i>key</i> {String} - The unique key of the array resource
     * <li><i>locale</i> {String} - The locale specifier that gives the
     * languages that the array's strings are written in
     * <li><i>pathName</i> {String} - The path to the file that contains
     * this array resource
     * <li><i>context</i> {String} - The context for this resource,
     * such as "landscape mode", or "7200dp", which differentiates it
     * from the base resource that has no special context. The default
     * if this property is not specified is undefined, meaning no
     * context.
     * <li><i>source</i> {Array.&lt;String&gt;} An array of strings
     * that are the source language values of this resource
     * <li><i>target</i> {Array.&lt;String&gt;} An array of strings
     * that are the target language values of this resource
     * </ul>
     *
     * @constructor
     * @param {Object} props Any of the properties given above
     */
    constructor(props) {
        super(props);

        this.source = [];
        this.subtype = "string-array";

        if (props) {
            const source = props.source || props.sourceArray;
            if (source) {
                if (!Array.isArray(source)) {
                    this.source = [source];
                } else if (source.length) {
                    // make a deep copy of the array
                    this.source = source.map(item => {
                         // both copies the string and ensures that it is a string type
                         return new String(item).toString();
                    });
                }
            }
            const target = props.target || props.targetArray;
            if (target) {
                if (!Array.isArray(target)) {
                    this.target = [target];
                } else if (target.length) {
                    // make a deep copy of the array
                    this.target = target.map(item => {
                         return new String(item).toString();
                    });
                }
            }
            if (props.subtype) {
                this.subtype = props.subtype;
            }
        }

        this.locale = this.locale || "en-US";
        this.datatype = this.datatype || "x-android-resource";
        this.resType = ResourceArray.resClass;
    }

    /**
     * Set the array of source strings for this resource.
     *
     * @override
     * @param {Array.<String>} arr the array of strings to set
     * as the source array
     */
    setSource(arr) {
        if (!arr || !Array.isArray(arr)) return;
        this.source = arr;
        this.dirty = true;
    }

    /**
     * Set the array of target strings for this resource.
     *
     * @param {Array.<String>} arr the array of strings to set
     * as the target array
     */
    setTarget(arr) {
        if (!arr || !Array.isArray(arr)) return;
        this.target = arr;
        this.dirty = true;
    }

    /**
     * Return the array of source strings. This method is here
     * for backwards compatilibity with the loctool plugins.
     *
     * @deprecated Use getSource() instead
     * @returns {Array.<String>} the array of source strings
     */
    getSourceArray() {
        return this.getSource();
    }

    /**
     * Return the array of target strings. This method is here
     * for backwards compatilibity with the loctool plugins.
     *
     * @deprecated Use getTarget() instead
     * @returns {Array.<String>} the array of target strings
     */
    getTargetArray() {
        return this.getTarget();
    }

    /**
     * Return the source string with the given index into the array.
     *
     * @param {number} i The index of the string being sought
     * @returns {String|undefined} the value of the string at index i or
     * undefined if i is outside the bounds of the array
     */
    getSourceItem(i) {
        return (i >= 0 && i < this.source.length) ? this.source[i] : undefined;
    }

    /**
     * Return the target string with the given index into the array.
     *
     * @param {number} i The index of the string being sought
     * @returns {String|undefined} the value of the string at index i or
     * undefined if i is outside the bounds of the array
     */
    getTargetItem(i) {
        return (this.target && i >= 0 && i < this.target.length) ? this.target[i] : undefined;
    }

    /**
     * Add a string to the source array at index i.
     *
     * @param {number} i the index at which to add the string
     * @param {String} str the string to add
     */
    addSourceItem(i, str) {
        if (typeof(i) === "undefined" || i < 0 || typeof(str) === "undefined") {
            return;
        }

        if (!this.source) {
            this.source = [];
        }

        this.source[i] = str;
        this.dirty = true;
    }

    /**
     * Add a string to the target array at index i.
     *
     * @param {number} i the index at which to add the string
     * @param {String} str the string to add
     */
    addTargetItem(i, str) {
        // can only add a target string if there is already a source string
        if (typeof(i) === "undefined" || i < 0 || typeof(str) === "undefined") {
            return;
        }

        if (!this.target) {
            this.target = [];
        }

        this.target[i] = str;
        this.dirty = true;
    }

    /**
     * Return the length of the array of strings in this resource.
     *
     * @returns {number} the length of the array of strings in this
     * resource
     */
    size() {
        let len = this.source ? this.source.length : 0;
        if (this.target) {
            len = Math.max(len, this.target.length);
        }
        return len;
    }

    /**
     * Clone this resource and override the properties with the given ones.
     *
     * @params {Object|undefined} overrides optional properties to override in
     * the cloned object
     * @returns {ResourceArray} a clone of this resource
     */
    clone(overrides) {
        const r = new ResourceArray(this);
        if (overrides) {
            for (let p in overrides) {
                r[p] = overrides[p];
            }
        }
        return r;
    }

    /**
     * Return true if the other resources contains the same resources as
     * the current one. The pathName, state, and comment fields are
     * ignored as minor variations.
     * @param {Resource} other another resource to test against the current one
     * @returns {boolean} true if these represent the same resource, false otherwise
     */
    equals(other) {
        if (!super.equals(other)) {
            logger.trace("parent returned false");
            return false;
        }

        if (this.source || other.source) {
            if (this.source && other.source) {
                if (this.source.length !== other.source.length) {
                    logger.trace("different length source arrays");
                    return false;
                }

                for (let i = 0; i < this.source.length; i++) {
                    if (this.source[i] !== other.array[i]) {
                        logger.trace("differed in source content '" + this.source[i] + "' !== '" + other.source[i] + "'");
                        return false;
                    }
                }
            } else {
                logger.trace("one has a source array, the other doesn't");
                return false;
            }
        }

        if (this.target || other.target) {
            if (this.target && other.target) {
                if (this.target.length !== other.target.length) {
                    logger.trace("different length target arrays");
                    return false;
                }

                for (let i = 0; i < this.target.length; i++) {
                    if (this.target[i] !== other.target[i]) {
                        logger.trace("differed in target content '" + this.target[i] + "' !== '" + other.target[i] + "'");
                        return false;
                    }
                }
            } else {
                logger.trace("one has a target array, the other doesn't");
                return false;
            }
        }

        logger.trace("Both the same");
        return true;
    }

    /**
     * Return true if the other resource contains the exact same resource as
     * the current one. All fields must match.
     *
     * @param {Resource} other another resource to test against the current one
     * @returns {boolean} true if these represent the same resource, false otherwise
     */
    equals(other) {
        if (!other || !this.same(other) || other.source.length !== this.source.length) return false;

        for (let i = 0; i < this.source.length; i++) {
            if (this.source[i] !== other.source[i]) return false;
        }

        if (this.target && this.target.length) {
            // if this is a source-only resource, there will be no target, and that's okay. Just ignore
            // the target for the purposes of this comparison.
            for (let i = 0; i < this.target.length; i++) {
                if (this.target[i] !== other.target[i]) return false;
            }
        }

        return true;
    }

    /**
     * Calculate a resource key string for this class of resource given the
     * parameters.
     *
     * @static
     * @return {String} a hash key
     */
    static hashKey(project, context, locale, reskey) {
        const key = ["ra", project, context, locale, reskey].join("_");
        logger.trace("Hashkey is " + key);
        return key;
    }

    /**
     * Return the a hash key that uniquely identifies this resource.
     *
     *  @return {String} a unique hash key for this resource
     */
    hashKey() {
        const locale = this.targetLocale || this.getSourceLocale();
        return ResourceArray.hashKey(this.project, this.context, locale, this.reskey);
    }

    /**
     * Return the a hash key that uniquely identifies the translation of
     * this resource to the given locale.
     *
     * @param {String} locale a locale spec of the desired translation
     * @return {String} a unique hash key for this resource
     */
    hashKeyForTranslation(locale) {
        return ResourceArray.hashKey(this.project, this.context, locale, this.reskey);
    }

    /**
     * Return the a hash key that uniquely identifies this resource, but uses the cleaned version of the string
     *
     *  @return {String} a unique hash key for this resource
     */
    cleanHashKey() {
        const cleaned = this.reskey && this.reskey.replace(/\s+/g, " ").trim() || "";
        const locale = this.targetLocale || this.getSourceLocale();
        return ResourceArray.hashKey(this.project, this.context, locale, cleaned);
    }

    /**
     * Return the a hash key that uniquely identifies the translation of
     * this resource to the given locale.
     *
     * @param {String} locale a locale spec of the desired translation
     * @return {String} a unique hash key for this resource
     */
    cleanHashKeyForTranslation(locale) {
        const cleaned = this.reskey && this.reskey.replace(/\s+/g, " ").trim() || "";
        return ResourceArray.hashKey(this.project, this.context, locale, cleaned);
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
        return this.source.every((str, i) => {
            return cleanString(str) === cleanString(resource.source[i]);
        });
    }
}

/**
 * The class of this kind of array resource.
 *
 * @static
 * @const
 */
ResourceArray.resClass = "array";

export default ResourceArray;
