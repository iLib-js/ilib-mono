/*
 * ResourceStringLocator.js - a representation of a resource instance plus which specific
 * string within that resource to use for the content
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

import { Resource, ResourceString, ResourcePlural, ResourceArray } from 'ilib-tools-common';

class ResourceStringLocator {
    /**
     * The resource instance that contains this content.
     *
     * @type {Resource}
     * @protected
     * @readonly
     */
    resource;

    /**
     * If the resource is a plural resource, this contains the name of the
     * plural category of the content.
     *
     * @type {string|undefined}
     * @protected
     * @readonly
     */
    category;

    /**
     * If the resource is an array resource, this contains the index of the
     * content within the array.
     *
     * @type {number|undefined}
     * @protected
     * @readonly
     */
    index;

    /**
     * Whether or not the content is the target string. If true, then the
     * content is the target string. If false, then the content is the
     * source string.
     *
     * @type {boolean}
     * @protected
     * @readonly
     */
    target;

    /**
     * Construct a new resource content instance.
     *
     * @param {Resource} resource the resource instance that contains this content
     * @param {boolean|undefined} [target] whether or not the content is the target string
     * @param {string|undefined} [category] the plural category of the content, if any
     * @param {number|undefined} [index] the index of the content within the array, if any
     * @constructor
     */
    constructor(resource, target = true, category, index) {
        this.resource = resource;
        this.category = category;
        this.index = index;
        this.target = target;
        
        if (resource.getType() === "plural" && typeof(category) !== 'string') {
            throw new Error("Cannot create a ResourceStringLocator for a plural resource without a plural category");
        }

        if (resource.getType() === "array" && typeof(index) !== 'number') {
            throw new Error("Cannot create a ResourceStringLocator for an array resource without an index");
        }
    }

    /**
     * Return the resource instance that contains this content.
     *
     * @returns {Resource} the resource instance that contains this content
     */
    getResource() {
        return this.resource;
    }

    /**
     * Return the plural category of the content, if any.
     *
     * @returns {string|undefined} the plural category of the content, if any
     */
    getCategory() {
        return this.category;
    }

    /**
     * Return the index of the content within the array, if any.
     *
     * @returns {number|undefined} the index of the content within the array, if any
     */
    getIndex() {
        return this.index;
    }

    /**
     * Return true if the content is the target string. If true, then the
     * content is the target string. If false, then the content is the
     * source string.
     *
     * @returns {boolean} true if the content is the target string
     */
    getTarget() {
        return this.target;
    }

    /**
     * Return true if the current content instance is the same as the other command. To be the
     * same, the two content instances must be for the same resource and that they are both
     * using the same category, index, and target.
     *
     * @param {ResourceStringLocator} other another resource content instance to compare against
     * @returns {boolean} true if the commands apply to the same resource and the same content
     * within that resource, false otherwise
     */
    isSameAs(other) {
        return (
            (this.resource === other.resource || this.resource.hashKey() === other.resource.hashKey()) &&
            this.category === other.category &&
            this.index === other.index &&
            this.target === other.target
        );
    }

    /**
     * Return the content of this resource. This is the source string if
     * target is false, or the target string if target is true.
     *
     * @returns {string} the content of this resource, or undefined
     * if the content cannot be determined
     */
    getContent() {
        const contentContainer = this.target ? this.resource.getTarget() : this.resource.getSource();
        if (contentContainer === undefined) {
            return "";
        }
        switch (this.resource.getType()) {
            default:
            case 'string':
                return contentContainer;

            case 'array':
                if (this.index === undefined) {
                    return "";
                }
                return contentContainer[this.index];

            case 'plural':
                if (this.category === undefined) {
                    return "";
                }
                return contentContainer[this.category];
        }
    }

    /**
     * Set the content of this resource. This is the source string if
     * target is false, or the target string if target is true. This method
     * knows how to set the content for all types of resources, including
     * string, array, and plural resources.
     *
     * @param {string} content the content of this resource
     * @returns {boolean} true if the set succeeded, false if the content was not found
     */
    setContent(content) {
        let res;
        // update the resource with the modified content
        switch (this.resource.getType()) {
            default:
                return false;

            case "string":
                res = /** @type {ResourceString} */ (this.resource);
                if (this.target) {
                    res.setTarget(content);
                } else {
                    res.setSource(content);
                }
                break;
            case "array":
                if (typeof(this.index) === 'undefined') {
                    // the fix is not applicable to this resource
                    return false;
                }
                res = /** @type {ResourceArray} */ (this.resource);
                if (this.target) {
                    res.addTargetItem(this.index, content);
                } else {
                    res.addSourceItem(this.index, content);
                }
                break;
            case "plural":
                if (!this.category) {
                    // the fix is not applicable to this resource
                    return false;
                }
                res = /** @type {ResourcePlural} */ (this.resource);
                if (this.target) {
                    res.addTargetPlural(this.category, content);
                } else {
                    res.addSourcePlural(this.category, content);
                }
                break;
        }
        return true;
    }
}

export default ResourceStringLocator;