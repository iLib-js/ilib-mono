/*
 * projectConfig.js - constants and validation for loctool project config files
 *
 * Copyright © 2026, HealthTap, Inc. and JEDLSoft
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

var path = require("path");

/** @type {string} JSON Schema URI written by loctool init and required when $schema is present */
var LOCTOOL_SCHEMA = "https://github.com/iLib-js/ilib-mono/packages/loctool/loctool-project-v1.schema.json";

var DEFAULT_CONFIG_FILE = "project.json";

/** @type {string[]} loctool projectType values */
var KNOWN_PROJECT_TYPES = ["android", "iosobjc", "swift", "web", "custom"];

/** @type {string[]} top-level properties recognized by loctool project configs */
var ALLOWED_PROPERTIES = [
    "$schema",
    "name",
    "id",
    "projectType",
    "sourceLocale",
    "pseudoLocale",
    "resourceDirs",
    "resourceFileTypes",
    "excludes",
    "includes",
    "plugins",
    "settings",
    "schema",
    "fileTypes"
];

/**
 * Return true if value is a non-empty string.
 *
 * @private
 * @param {*} value
 * @returns {boolean}
 */
function isNonEmptyString(value) {
    return typeof(value) === "string" && value.length > 0;
}

/**
 * Return the base name of the project config file to search for during the tree walk.
 *
 * @param {Object} settings an object containing the current settings
 * @returns {String} the config file base name (not a path)
 */
function getConfigFileBaseName(settings) {
    return (settings && settings.configFileBaseName) || DEFAULT_CONFIG_FILE;
}

/**
 * Return the path where loctool init should write the project config file.
 *
 * @param {Object} settings CLI settings (rootDir, configFileBaseName)
 * @returns {String} output file path
 */
function getInitOutputPath(settings) {
    var rootDir = (settings && settings.rootDir) || ".";
    return path.join(rootDir, getConfigFileBaseName(settings));
}

/**
 * Validate whether parsed JSON is a loctool project configuration.
 *
 * @param {Object} props parsed config file contents
 * @returns {{valid: boolean, reason?: string, unknownProperties?: string[]}}
 */
function validateLoctoolConfig(props) {
    if (!props || typeof(props) !== "object" || Array.isArray(props)) {
        return {valid: false, reason: "config is not a JSON object"};
    }

    if (props.$schema !== undefined) {
        if (props.$schema !== LOCTOOL_SCHEMA) {
            return {
                valid: false,
                reason: "$schema must be \"" + LOCTOOL_SCHEMA + "\" when present"
            };
        }
    }

    var missing = [];
    if (!isNonEmptyString(props.id)) {
        missing.push("id");
    }
    if (!isNonEmptyString(props.name)) {
        missing.push("name");
    }
    if (!isNonEmptyString(props.projectType)) {
        missing.push("projectType");
    }

    if (missing.length > 0) {
        return {
            valid: false,
            reason: missing.length === 1 ?
                "missing or invalid required property: " + missing.join(", ") :
                "missing or invalid required properties: " + missing.join(", ")
        };
    }

    if (KNOWN_PROJECT_TYPES.indexOf(props.projectType) === -1) {
        return {
            valid: false,
            reason: "projectType must be one of: " + KNOWN_PROJECT_TYPES.join(", ")
        };
    }

    var requiredKeys = ["id", "name", "projectType"];

    var extraKeys = Object.keys(props).filter(function(key) {
        return requiredKeys.indexOf(key) === -1;
    });

    if (extraKeys.length === 0) {
        return {valid: true};
    }

    var allowedExtras = extraKeys.filter(function(key) {
        return ALLOWED_PROPERTIES.indexOf(key) !== -1;
    });
    var unknownExtras = extraKeys.filter(function(key) {
        return ALLOWED_PROPERTIES.indexOf(key) === -1;
    });

    if (allowedExtras.length === 0 && unknownExtras.length > 0) {
        return {
            valid: false,
            reason: "config contains only unrecognized properties: " + unknownExtras.join(", ")
        };
    }

    var result = {valid: true};
    if (unknownExtras.length > 0) {
        result.unknownProperties = unknownExtras;
    }
    return result;
}

module.exports = {
    LOCTOOL_SCHEMA: LOCTOOL_SCHEMA,
    DEFAULT_CONFIG_FILE: DEFAULT_CONFIG_FILE,
    KNOWN_PROJECT_TYPES: KNOWN_PROJECT_TYPES,
    ALLOWED_PROPERTIES: ALLOWED_PROPERTIES,
    getConfigFileBaseName: getConfigFileBaseName,
    getInitOutputPath: getInitOutputPath,
    validateLoctoolConfig: validateLoctoolConfig
};
