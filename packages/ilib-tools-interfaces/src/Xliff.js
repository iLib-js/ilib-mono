/*
 * Xliff.js - super class that represents a xliff
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
 * @class a class that represents resources as an xliff file.
 * extracted from the code.
 * @abstract
 */
class Xliff {
    
    version = "1.2";
    sourceLocale = "en-US";
    // place to store the translation units
    tu = [];
    tuhash = {};
    lines = 0;
    
    /**
     * Construct a new xliff element instance.
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} [options.getLogger] a callback function provided by the
     * linter to retrieve the log4js logger
     * @param {object} [options.settings] additional settings that can be passed from the
     * linter to pipeline element from the configuration file
     */
    constructor(props) {
        if (this.constructor === Xliff) {
            throw new Error("Cannot instantiate abstract class PipelineElement directly!");
        }

        if (props) {
            this.sourceLocale = props.sourceLocale || props.locale;
            this.targetLocale = props.targetLocale;
            this.reskey = props.key || props.reskey;
        }
        
    }

    /**
     * Return the a hash key that uniquely identifies this resource.
     *
     * @abstract
     * @returns {string} a unique hash key for this resource
     */
    serialize() {
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
     */
    deserialize() {
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
     * @returns {Array.<Object>} the translation units in this xliff
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
     * @param {Array.<Object>} files the translation units to add to this xliff
     */
    addTranslationUnits(units) {
        units.forEach((unit) => {
            this.addTranslationUnit(unit);
        });
    }
}

export default Xliff;