/*
 * uniData.js - models a unicode character database (UCD) file
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

import UnicodeFile from './UnicodeFile';
import CharacterInfo from './CharacterInfo';

/**
 * @class
 * Return an object that represents a unicode character database.<p>
 *
 * The options must contain only one of the following properties:
 *
 * <ul>
 * <li>path - Path to the file to read on disk
 * <li>string - The actual in-memory text of the file
 * </ul>
 *
 * @constructor
 * @param {Object.<{path:string,string:string}>} options Options controlling the construction of the instance 
 */
export default class UnicodeData {
    constructor(options) {
	    this.uf = new UnicodeFile(options);
	}

    /**
     * Return the number of rows in this character database. Each row is
     * represented by a CharacterInfo object.
     *
     * @return {number} the number of rows in this character database
     */
    length() {
        return this.uf.length();
    }

    /**
     * Return the character info for a particular row in the database.
     *
     * @param {number} index the row to return
     * @returns {CharacterInfo?} the character info at the given row
     */
    get(index) {
        return new CharacterInfo(this.uf.get(index));
    }
};
