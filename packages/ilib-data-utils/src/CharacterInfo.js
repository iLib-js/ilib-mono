/*
 * CharacterInfo.js - info on one character in a unicode character database file
 * 
 * Copyright © 2022, JEDLSoft
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

import { hexToChar } from './Utils';

/**
 * @class
 * Represents information about a particular character.
 * 
 * @constructor
 * @param {string} row a row from the UnicodeData.txt file to parse
 */
export default class CharacterInfo {
    constructor(fields) {
        if (typeof(fields) !== 'object') {
            return undefined;
        }
    
        this.c = hexToChar(fields[0]);
        this.name = fields[1];
        this.category = fields[2];
        this.ccc = (fields[3].length > 0) ? parseInt(fields[3], 10) : 0;
        this.bidiClass = fields[4];
    
        if (fields[5].length > 0) {
            var decomp = fields[5];
            var start = decomp.indexOf('<');
            if (start !== -1) {
                var end = decomp.lastIndexOf('>');
                this.decompType = decomp.substring(start+1, end);
                decomp = decomp.substring(end+1);
            } else {
                this.decompType = "canon"; // default is canonical decomposition
            }
            var chars = decomp.split(' ');
            this.decomp = "";
            for (var i = 0; i < chars.length; i++) {
                if (chars[i].length > 0) {
                    this.decomp += hexToChar(chars[i]);
                }
            }
        }
    
        // TODO get the digit value from fields 6, 7, 8
    
        this.bidiMirrored = (fields[9] && fields[9] == 'Y');
        this.upper = (fields[12] && fields[12].length > 0) ? hexToChar(fields[12]) : "";
        this.lower = (fields[13] && fields[13].length > 0) ? hexToChar(fields[13]) : "";
        this.title = (fields[14] && fields[14].length > 0) ? hexToChar(fields[14]) : "";
    }

    /**
     * @return {string}
     */
    getCharacter() {
        return this.c;
    }

    /**
     * @return {string}
     */
    getName() {
        return this.name;
    }

    /**
     * @return {string}
     */
    getCategory() {
        return this.category;
    }

    /**
     * @return {number}
     */
    getCombiningClass() {
        return this.ccc;
    }

    /**
     * @return {string}
     */
    getBidiClass() {
        return this.bidiClass;
    }

    /**
     * @return {string}
     */
    getDecompositionType() {
        return this.decompType || "";
    }

    /**
     * @return {string}
     */
    getDecomposition() {
        return this.decomp || this.c;
    }

    /**
     * @return {string}
     */
    getNumericType() {

    }

    /**
     * @return {number}
     */
    getNumericValue() {

    }

    /**
     * @return {boolean}
     */
    getBidiMirrored() {
        return this.bidiMirrored;
    }

    /**
     * @return {string}
     */
    getSimpleUppercase() {
        return this.upper;
    }

    /**
     * @return {string}
     */
    getSimpleLowercase() {
        return this.lower;
    }

    /**
     * @return {string}
     */
    getSimpleTitlecase() {
        return this.title;
    }
};
