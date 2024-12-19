/**
 * convertResources.js - convert the resources from the tools common representation
 * to the loctool internal representation.
 *
 * Copyright © 2021, 2023 Box, Inc.
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

var ToolsCommon = require("ilib-tools-common");
var ResourceFactory = require("./ResourceFactory.js");

/**
 * Convert the given resource from the tools common representation to
 * the loctool internal representation.
 *
 * @param {Resource} resource the resource to convert in tools common representation
 * @returns {Resource} the converted resource in loctool representation
 */
var convertResourceToLoctool = function(resource) {
    var type = resource.getType();
    var options = {
        resType: type,
        project: resource.getProject(),
        sourceLocale: resource.getSourceLocale(),
        targetLocale: resource.getTargetLocale(),
        pathName: resource.getPath(),
        datatype: resource.getDataType(),
        context: resource.getContext(),
        reskey: resource.getKey(),
        state: resource.getState(),
        comment: resource.getComment(),
        autoKey: resource.autoKey
    };
    if (type === "string") {
        options.source = resource.getSource();
        options.target = resource.getTarget();
    } else if (type === "plural") {
        options.sourceStrings = resource.getSource();
        options.targetStrings = resource.getTarget();
    } else if (type === "array") {
        options.sourceArray = resource.getSource();
        options.targetArray = resource.getTarget();
    }
    return ResourceFactory(options);
};

/**
 q* Convert the given resource from the loctool internal representation to
 * the tools common representation.
 *
 * @param {Resource} resource the resource to convert in loctool representation
 * @returns {Resource} the converted resource in tools common representation
 */
var convertResourceToCommon = function(resource) {
    var constructor =
        resource.getType() === "array" ? ToolsCommon.ResourceArray :
        resource.getType() === "plural" ? ToolsCommon.ResourcePlural :
            ToolsCommon.ResourceString;
    return new constructor({
        project: resource.getProject(),
        sourceLocale: resource.getSourceLocale(),
        targetLocale: resource.getTargetLocale(),
        key: resource.getKey(),
        source: resource.source || resource.sourceStrings || resource.sourceArray,
        target: resource.target || resource.targetStrings || resource.targetArray,
        pathName: resource.getPath(),
        state: resource.getState(),
        comment: resource.getComment(),
        datatype: resource.getDataType(),
        context: resource.getContext(),
        autoKey: resource.autoKey
    });
};

module.exports = {
    convertResourceToLoctool: convertResourceToLoctool,
    convertResourceToCommon: convertResourceToCommon
};