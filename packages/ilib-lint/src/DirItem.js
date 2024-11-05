/*
 * DirItem.js - Represents a directory item
 *
 * Copyright © 2022 JEDLSoft
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

import log4js from 'log4js';

const logger = log4js.getLogger("ilib-lint.DirItem");

/**
 * @class Represent a directory item.
 *
 * A directory item is the superclass of either a source file or a project.
 * Directories themselves are not represented.
 *
 * @abstract
 */
class DirItem {
    /**
     * Construct a new directory item
     * The options parameter can contain any of the following properties:
     *
     * - filePath {String} path to the file
     * - settings {Object} the settings from the ilib-lint config that
     *   apply to this file
     * - pluginManager {PluginManager} the plugin manager for this run of
     *   the ilib-lint tool
     */
    constructor(filePath, options, project) {
        if (!options || !filePath) {
            throw "Incorrect options given to DirItem constructor";
        }
        this.filePath = filePath;
        this.settings = options.settings;
        this.pluginMgr = options.pluginManager;
        this.project = project;
    }

    /**
     * Return the file path for this source file.
     *
     * @returns {String} the file path for this source file
     */
    getFilePath() {
        return this.filePath;
    }

    /**
     * Parse the current directory item.
     *
     * @returns {Array.<IntermediateRepresentation>} the parsed
     * representations of this file
     * @abstract
     */
    parse() {}

    /**
     * Check the directory item and return a list of issues found in it.
     *
     * @param {Array.<Locale>} locales a set of locales to apply
     * @returns {Array.<Result>} a list of natch results
     * @abstract
     */
    findIssues(locales) {}
};

export default DirItem;
