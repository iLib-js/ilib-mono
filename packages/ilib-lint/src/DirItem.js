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

import { Result } from "ilib-lint-common";
import PluginManager from "./PluginManager.js";

// type imports
/** @ignore @typedef {import("./Project.js").default} Project */

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
     * The file path for this directory item
     * @type {String}
     */
    filePath;

    /**
     * The settings from the ilib-lint config that apply to this file
     * @type {Record<string, unknown> | undefined}
     */
    settings;

    /**
     * The plugin manager for this run of the ilib-lint tool
     * @type {PluginManager|undefined}
     */
    pluginMgr;

    /**
     * The project that this directory item is part of
     * @type {Project|undefined}
     */
    project;

    /**
     * Construct a new directory item
     * The options parameter can contain any of the following properties:
     *
     * @param {String} filePath path to the file
     * @param {Object} options options for constructing this directory item
     * @param {Record<string, unknown>} [options.settings] the settings from the ilib-lint config that
     *   apply to this file
     * @param {PluginManager} [options.pluginManager] the plugin manager for this run of
     *   the ilib-lint tool
     * @param {Project} [project] the project that this directory item is part of
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
     * Return the file path for this directory item.
     *
     * @returns {String} the file path for this directory item
     */
    getFilePath() {
        return this.filePath;
    }

    /**
     * Check the directory item and return a list of issues found in it.
     *
     * @param {Array.<string>} locales a set of locales to apply
     * @returns {Array.<Result>} a list of natch results
     * @abstract
     */
    findIssues(locales) {
        throw new Error("Not implemented");
    }
}

export default DirItem;
