/*
 * Plugin.js - common SPI that all plugins must implement
 *
 * Copyright © 2022-2023 JEDLSoft
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
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} options.getLogger a callback function provided by
     * the linter to retrieve the log4js logger
     * @constructor
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
     * @returns {Promise<void>|void} a promise to initialize or undefined if the
     * initialization is synchronous or if no initialization is necessary
     */
    init() {}

    /**
     * For a plugin that implements rules, this returns a list of Rule
     * classes that this plugin implements. Note this is the class itself,
     * not an instance of the class. The linter may need to instantiate
     * this rule multiple times with different optional parameters.
     *
     * @returns {Array.<Class|Object>} list of Rule classes implemented
     * by this plugin or objects that are definitions of declarative rules
     */
    getRules() {
        return [];
    }

    /**
     * Return a number of pre-defined rule sets. The idea behind this
     * method is that the plugin can define sets of rules that users of
     * the plugin can rely on. As the plugin
     * developer adds new rules in their plugin, they can also update
     * the rule set to include those new rules and users of this plugin
     * will get enhanced functionality automatically without changing
     * their own configuration.<p>
     *
     * For example, if there is a plugin named
     * "android", the plugin writer can add support for Java, Kotlin,
     * and properties files in the same plugin by adding parsers and rules
     * for each file type. They can then also add rulesets called "java",
     * "kotlin" and "properties" which will apply all the rules from this
     * plugin that are appropriate for the file types.<p>
     *
     * By convention, these rulesets are named the same as the file type
     * that they support, but this is not a strict requirement. Plugin
     * writers should document the rulesets that the plugin supports in
     * the README.md for that plugin so that users know that it is available.
     *
     * @returns {Object} an object where the properties are the names of
     * rulesets and the values are objects that configure a ruleset. The
     * properties of this subobject are the names of the rules and the
     * values are the optional parameters for the rule, or "true" to indicate
     * that the rule should be turned on for this set.
     */
    getRuleSets() {
        return {};
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
     * @returns {Array.<Class|Object>} list of Formatter classes implemented
     * by this plugin or objects that are definitions of declarative formatters
     */
    getFormatters() {
        return [];
    }

    /**
     * For a "fixer" type of plugin, this returns a list of Fixer
     * classes that this plugin implements. Note this is the class, not an
     * instance of the class. The linter may need to instantiate this
     * formatter multiple times.
     *
     * @returns {Array.<Class>} array of Fixer classes implemented
     * by this plugin
     */
    getFixers() {
        return [];
    }

    /**
     * For a "transformer" type of plugin, this returns a list of Transformer
     * classes that this plugin implements. Note this is the class, not an
     * instance of the class. The linter may need to instantiate this transformer
     * multiple times.
     *
     * @returns {Array.<Class>} list of Transformer classes implemented
     * by this plugin
     */
    getTransformers() {
        return [];
    }

    /**
     * For a "serializer" type of plugin, this returns a list of Serializer
     * classes that this plugin implements. Note this is the class, not an
     * instance of the class. The linter may need to instantiate this serializer
     * multiple times.
     * @returns {Array.<Class>} list of Serializer classes implemented
     * by this plugin
     */
    getSerializers() {
        return [];
    }
};

export default Plugin;
