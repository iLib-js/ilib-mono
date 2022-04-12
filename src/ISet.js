/*
 * ISet.js - ilib Set class definition for platforms older than ES6
 * (basically a polyfill for Set)
 *
 * Copyright © 2015, 2021-2022 JEDLSoft
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

/**
 * @class A polyfill for Set in older browsers.
 */
class ISet {
    /**
     * Create a new set with elements in the given array. The type of
     * the set is gleaned from the type of the first element in the
     * elements array, or the first element added to the set. The type
     * may be "string" or "number", and all elements will be returned
     * as elements of that type.
     *
     * @param {Array.<string|number>=} elements initial elements to add to the set
     * @constructor
     */
    constructor(elements) {
        this.elements = {};

        if (elements && elements.length) {
            for (var i = 0; i < elements.length; i++) {
                this.elements[elements[i]] = true;
            }

            this.type = typeof(elements[0]);
        }
    }

    /**
     * @private
     */
    _addOne(element) {
        if (this.isEmpty()) {
            this.type = typeof(element);
        }

        if (!this.elements[element]) {
            this.elements[element] = true;
            return true;
        }

        return false;
    }

    /**
     * Adds the specified element or array of elements to this set if it is or they are not
     * already present.
     *
     * @param {*|Array.<*>} element element or array of elements to add
     * @return {boolean} true if this set did not already contain the specified element[s]
     */
    add(element) {
        var ret = false;

        if (typeof(element) === "object") {
            for (var i = 0; i < element.length; i++) {
                ret = this._addOne(element[i]) || ret;
            }
        } else {
            ret = this._addOne(element);
        }

        return ret;
    }

    /**
     * Removes all of the elements from this set.
     */
    clear() {
        this.elements = {};
    }

    /**
     * Returns true if this set contains the specified element.
     * @param {*} element the element to test
     * @return {boolean}
     */
    contains(element) {
        return this.elements[element] || false;
    }


    /**
     * Returns true if this set contains no elements.
     * @return {boolean}
     */
    isEmpty() {
        return (Object.keys(this.elements).length === 0);
    }

    /**
     * Removes the specified element from this set if it is present.
     * @param {*} element the element to remove
     * @return {boolean} true if the set contained the specified element
     */
    remove(element) {
        if (this.elements[element]) {
            delete this.elements[element];
            return true;
        }

        return false;
    }

    /**
     * Return the set as a javascript array.
     * @return {Array.<*>} the set represented as a javascript array
     */
    asArray() {
        var keys = Object.keys(this.elements);

        // keys is an array of strings. Convert to numbers if necessary
        if (this.type === "number") {
            var tmp = [];
            for (var i = 0; i < keys.length; i++) {
                tmp.push(Number(keys[i]).valueOf());
            }
            keys = tmp;
        }

        return keys;
    }

    /**
     * Represents the current set as json.
     * @return {string} the current set represented as json
     */
    toJson() {
        return JSON.stringify(this.asArray());
    }

    /**
     * Convert to a javascript representation of this object.
     * In this case, it is a normal JS array.
     * @return {*} the JS representation of this object
     */
    toJS() {
        return this.asArray();
    }

    /**
     * Convert from a js representation to an internal one.
     * @return {ISet|undefined} the current object, or undefined if the conversion did not work
     */
    fromJS(obj) {
        return this.add(obj) ? this : undefined;
    }
}

ISet.prototype.has = ISet.prototype.contains; // for compatibility with ES6

export default ISet;