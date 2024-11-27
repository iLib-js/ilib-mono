/*
 * IntermediateFile.js - represents an intermediate file that is used to
 * store the results of string extraction for the purpose of translation.
 *
 * Copyright © 2024 Box, Inc.
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
 * @interface Represents an intermediate file that is used to store the results of string extraction for the purpose of translation.
 *
 * @param {Object} options options for the intermediate file
 * @param {String} options.path path to the file
 * @param {String} options.project name of the project that these strings belong to
 * @param {String} options.version
 * @param {String} options.sourceLocale locale of the source strings
 * @param {String} [options.targetLocale] locale of the target strings (if any)
 * @param {boolean} [options.contextInKey] whether not the context of the string
 * should be included in the key
 * @param {String} [options.datatype] type of the data where these strings came from
 * @abstract
 */
var IntermediateFile = function(options) {};

IntermediateFile.prototype = {
    /**
     * Read the given intermediate file and return the resources that it contains.
     * @abstract
     * @returns {TranslationSet} a set containing the resources in the file
     * @throws {Error} if the file cannot be read
     */
    read: function() {},

    /**
     * Encode the given resources into the type of intermediate
     * file and write it out.
     *
     * @abstract
     * @param {TranslationSet} set the set of resources to write
     * @throws {Error} if the file cannot be written
     */
    write: function(set) {}
};

module.exports = IntermediateFile;
