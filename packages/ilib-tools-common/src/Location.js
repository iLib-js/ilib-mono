/*
 * Location.js - Location information for a resource
 *
 * Copyright © 2024 JEDLSoft
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
 * @class Represents the location of a resource in a file
 */
class Location {
    /**
     * Construct a new Location instance. A location should have either an offset from
     * the beginning of the file, or a line & character number. The first line of the
     * file is considered line 0, and the first character in a line is character 0.
     *
     * @constructor
     * @param {Object} info location info of the resource
     * @param {Number?} info.offset offset of the first character of the resource
     * relative to the beginning of the file
     * @param {Number?} info.line line number of the resource
     * @param {Number?} info.char character number of the resource
     */
    constructor(info) {
        this.info = {
        };

        if (info) {
            if (info.offset) {
                this.info.offset = parseInt(info.offset);
            }
            if (info.line) {
                this.info.line = parseInt(info.line);
                this.info.char = parseInt(info.char);
            }
        }
    }

    /**
     * Return the location information
     */
    getLocation() {
        return this.info;
    }
}

export default Location;