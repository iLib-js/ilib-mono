/*
 * ILibPluralSyntaxChecker - Check the syntax of a plural string from ilib
 *
 * Copyright © 2025 JEDLSoft
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

import { ResourceString, ResourcePlural } from 'ilib-tools-common';
import { Result, Rule } from 'ilib-lint-common';


export function isPluralString(str) {
    // A plural string in ilib format contains at least one "#"
    // and possibly multiple "|" characters where the number of "|"
    // characters is less than the number of "#" characters.
    // For example: "one#1|two#2|other#3" is a valid plural string.
    // It must also not be empty.
    if (!str || typeof str !== 'string' || str.trim() === '') {
        return false;
    }
    const countHash = (str.match(/#/g) || []).length;
    const countPipe = (str.match(/\|/g) || []).length;
    return countHash > 0 && countPipe < countHash;
}

function convertPluralStringToObject(str) {
    if (!isPluralString(str)) {
        throw new Error("Invalid plural string format");
    }
    const parts = str.split("|");
    const pluralObject = {};
    parts.forEach(part => {
        let [key, value] = part.split("#");
        if (!key) key = "other"; // default key if none provided
        if (value) {
            pluralObject[key.trim()] = value;
        }
    });
    return pluralObject;
}

function convertObjectToPluralString(obj) {
    if (typeof obj !== 'object' || obj === null) {
        throw new Error("Invalid object format");
    }
    return Object.entries(obj).map(([key, value]) => `${key}#${value}`).join("|");
}

/**
 * Convert a ResourceString containing an ilib-style plural string
 * to a ResourcePlural instance. This function checks if the
 * provided ResourceString is indeed a plural string and then
 * converts it to a ResourcePlural instance with the same properties
 * as the ResourceString except for the source and target, which are
 * converted to objects representing the plural string.
 * If the provided resource is not a ResourceString or does not
 * represent a plural string, it returns undefined.
 *
 * @param {ResourceString} resource the ResourceString to convert
 * @returns {ResourcePlural|undefined} A new ResourcePlural instance with
 * the same properties as the ResourceString, or undefined if the
 * string resource is not an ilib-style plural string.
 */
export function convertStringToPlural(resource) {
    if (!resource || !(resource instanceof ResourceString) || !isPluralString(resource.source)) {
        return undefined;
    }
    return new ResourcePlural({
        ...resource, // spread the properties from the ResourceString but override some of them
        source: convertPluralStringToObject(resource.getSource()),
        target: convertPluralStringToObject(resource.getTarget())
    });
}

/**
 * Convert a ResourcePlural to a ResourceString. This function takes a
 * ResourcePlural instance and converts it to a ResourceString instance
 * with the same properties as the ResourcePlural, but the source and target
 * are converted back to an ilib-style plural string format.
 *
 * @param {ResourcePlural} resource The ResourcePlural to convert.
 * @returns {ResourceString|undefined} A new ResourceString instance with
 * the same properties as the ResourcePlural, or undefined if the resource
 * is not a ResourcePlural.
 */
export function convertPluralToString(resource) {
    // If the resource is not a ResourcePlural, we cannot convert it
    if (!resource || !(resource instanceof ResourcePlural)) {
        return undefined;
    }
    return new ResourceString({
        ...resource, // spread the properties from the ResourcePlural but override some of them
        source: convertObjectToPluralString(resource.getSource()),
        target: convertObjectToPluralString(resource.getTarget())
    });
}
