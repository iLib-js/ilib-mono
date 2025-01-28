/*
 * ResourceConvert.js - functions to convert between resource types
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

var ResourceString = require("./ResourceString.js");
var ResourcePlural = require("./ResourcePlural.js");
var convertRes = require("./convertResources.js");
var ToolsCommon = require("ilib-tools-common");

var convertResourceToLoctool = convertRes.convertResourceToLoctool;
var convertResourceToCommon = convertRes.convertResourceToCommon;

var convertPluralResToICU = ToolsCommon.convertPluralResToICU;
var convertICUToPluralRes = ToolsCommon.convertICUToPluralRes;

/**
 * Convert a plural resource to an ICU-style plural string resource.
 * This allows for shoe-horning plurals into systems that do not
 * support plurals, or at least don't offer a way to import them
 * properly. All other fields are copied from the plural resource
 * parameter into the returned resource string unchanged.
 * The complement function is convertICUToPluralRes() which does
 * the opposite.
 *
 * @param {ResourcePlural} resource the resource to convert into an
 * ICU-style plural resource string
 * @param {ResourceString} the plural resource converted into a
 * string resource
 */
module.exports.convertPluralResToICU = function(resource) {
    var commonPlural = convertResourceToCommon(resource);
    var commonString = convertPluralResToICU(commonPlural);
    return convertResourceToLoctool(commonString);
};

/**
 * Convert a an ICU-style plural string resource into plural resource.
 * This allows for shoe-horning plurals into systems that do not
 * support plurals, or at least don't offer a way to export them
 * properly. All other fields are copied from the string resource
 * parameter into the returned resource plural unchanged.
 * The complement function is convertPluralResToICU() which does
 * the opposite.
 *
 * @param {ResourceString} resource the ICU-style plural resource string
 * to convert into a plural resource
 * @param {ResourcePlural} the resource string converted into a
 * plural resource
 */
module.exports.convertICUToPluralRes = function(resource) {
    var commonString = convertResourceToCommon(resource);
    var commonPlural = convertICUToPluralRes(commonString);
    return convertResourceToLoctool(commonPlural);
};
