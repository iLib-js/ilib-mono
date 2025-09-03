/*
 * Xliff.js - superclass that represents an xliff file
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

/**
 * @class represents the API that every Xliff file subclass must implement
 * @abstract
 */
class Xliff {
    
    version = "1.2";
    sourceLocale = "en-US";
    // place to store the translation units
    tu = [];
    tuhash = {};
    
    /**
     * Construct a new xliff element instance.
     *
     * @param {Object} [props] props to the constructor
     */
    constructor(props) {
        if (this.constructor === Xliff) {
            throw new Error("Cannot instantiate abstract class Xliff directly!");
        }
    }

    /**
     * Serialize this xliff instance to a string that contains
     * the xliff format xml text.
     *
     * @abstract
     * @param {boolean} untranslated if true, add the untranslated resources
     * to the xliff file without target tags. Otherwiwe, untranslated
     * resources are skipped.
     * @returns {string} the current instance encoded as an xliff format
     * xml text
     */
    serialize(untranslated) {
        throw new Error("serialize() not implemented");
    }

    /**
     * Deserialize the given string as an xml file in xliff format
     * into this xliff instance.
     * 
     * @abstract
     * @param {String} xml the xliff format text to parse
     * @param {string | undefined} resfile the path to the xliff file,
     * or undefined if this xml file is being parsed from a string
     * instead of a file
     * @returns {Resource[]} An array of Resource instances representing
     * the strings in this xliff file
     */
    deserialize(xml, resfile) {
        throw new Error("deserialize() not implemented");
    }

    /**
     * Parse webOS xliff files
     *
     * @abstract
     * @param {Element} xliff
     * @param {string|undefined} resfile the path to the xliff file
     * that contains the translation units, or undefined if this xliff
     * is being parsed from a string
     */
    parse(xliff, resfile) {
        throw new Error("parse() not implemented");
    }

    /**
     * Return the number of translation units in this xliff file.
     *
     * @return {number} the number of translation units in this xliff file
     */
    size() {
        return this.tu.length;
    }

    /**
     * Get the translation units in this xliff.
     *
     * @returns {Resource[]} the translation units in this xliff
     */
    getTranslationUnits() {
        return this.tu;
    }

    /**
     * Add this translation unit to this xliff.
     *
     * @param {TranslationUnit} unit the translation unit to add to this xliff
     */
    addTranslationUnit(unit) {
        throw new Error("addTranslationUnit() not implemented");
    }

    /**
     * Add translation units to this xliff.
     *
     * @param {TranslationUnit[]} files the translation units to add to this xliff
     */
    addTranslationUnits(units) {
        units.forEach((unit) => {
            this.addTranslationUnit(unit);
        });
    }

    /**
     * Clear the current xliff file of all translation units and start from scratch. All
     * the settings from the constructor are still kept. Only the translation units are
     * removed.
     */
    clear() {
        this.tu = [];
        this.tuhash = {};
    }

}

export default Xliff;