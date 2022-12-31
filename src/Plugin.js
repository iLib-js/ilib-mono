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
     * Construct a new plugin. The options can vary depending on the
     * the plugin.
     */
    constructor(options) {
        if (this.constructor === Plugin) {
            throw new Error("Cannot instantiate abstract class Plugin directly!");
        }
    }

    /**
     * Initialize the current plugin, if necessary.
     *
     * @abstract
     */
    init() {}

    /**
     * For a "rule" type of plugin, this returns a list of Rule classes
     * that this plugin implements. Note this is the class, not an
     * instance of the class. The linter may need to instantiate this
     * rule multiple times.
     *
     * @returns {Array.<Class>} list of Rule classes implemented by this
     * plugin
     */
    getRules() {
        return [];
    }

    /**
     * For a "parser" type of plugin, this returns a list of Parser classes
     * that this plugin implements. Note this is the class, not an
     * instance of the class. The linter may need to instantiate this
     * parser multiple times.
     *
     * @returns {Array.<Class>} list of Parser classes implemented by this
     * plugin
     */
    getParsers() {
        return [];
    }

    /**
     * For a "formatter" type of plugin, this returns a list of Formatter
     * classes that this plugin implements. Note this is the class, not an
     * instance of the class. The linter may need to instantiate this
     * formatter multiple times.
     *
     * @returns {Array.<Class>} list of Formatter classes implemented by this
     * plugin
     */
    getFormatters() {
        return [];
    }
};

export default Plugin;
