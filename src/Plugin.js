/*
 * Plugin.js - common SPI that all plugins must implement
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

/**
 * @class common SPI that all plugins must implement
 * @abstract
 */
class Plugin {
    /**
     * Construct a new plugin.
     */
    constructor(options) {
    }

    /**
     * Initialize the current plugin,
     * @abstract
     */
    init() {}

    /**
     * Return the type of this plugin. This can be one of the
     * following:
     *
     * <ul>
     * <li>rule - this plugin implements a new rules
     * <li>parser - this plugin knows how to parse files more deeply
     * than line-by-line
     * <li>formatter - this plugin formats results for a particular
     * type of output
     * </ul>
     * 
     * @returns {String} tells what type of plugin this is
     * @abstract
     */
    getType() {
    }

    /**
     * Return the list of extensions of the files that this parser handles.
     * The extensions are listed without the dot. eg. ["json", "jsn"]
     *
     * @returns {Array.<String>} a list of file name extensions
     */
    getExtensions() {
        return [];
    }

    /**
     * For a "rule" type of plugin, this returns a list of Rule instances
     * that this plugin implements.
     *
     * @returns {Array.<Rule>} list of Rule instances implemented by this
     * plugin
     */
    getRules() {
        return [];
    }

    /**
     * For a "parser" type of plugin, this returns a list of Parser classes
     * that this plugin implements.
     *
     * @returns {Array.<Parser>} list of Parser classes implemented by this
     * plugin
     */
    getParsers() {
        return [];
    }

    /**
     * For a "formatter" type of plugin, this returns a list of Formatter
     * instances that this plugin implements.
     *
     * @returns {Array.<Formatter>} list of Formatter instances implemented by this
     * plugin
     */
    getFormatters() {
        return [];
    }
};

export default Plugin;
