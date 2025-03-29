/*
 * XmlUtils.js - utils to parse xml elements and retrieve attributes and text
 *
 * Copyright © 2024-2025 Box, Inc.
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

// type imports
/** @ignore @typedef {import("ilib-xml-js").Element} Element */

/**
 * Return value of a specified attribute from a supplied xml element converted to a string. If the attribute is not
 * found, undefined is returned.
 *
 * @param {Element | undefined} element
 * @param {string} attrName
 * @returns {string | undefined}
 */
export const getAttribute = (element, attrName) => {
    const value = element?.attributes?.[attrName];
    if (value !== undefined) {
        return String(value);
    } else {
        return undefined;
    }
};

/**
 * Return value of the first text element from a supplied xml element converted to a string. If the text element is not
 * found, undefined is returned.
 *
 * @param {Element | undefined} element
 * @returns {string | undefined}
 */
export const getText = (element) => {
    if (element === undefined) {
        return undefined;
    }
    const textElement = element.elements?.find((e) => e.type === "text");
    if (textElement) {
        return String(textElement.text ?? "");
    } else {
        return undefined;
    }
};

/**
 * Return array of elements with a specified name from a supplied xml element or undefined if the element is not found
 * or has no children.
 *
 * @param {Element | undefined} element
 * @param {string} elName
 * @returns {Element[] | undefined}
 */
export const getChildrenByName = (element, elName) => {
    return element?.elements?.filter((e) => e.name === elName);
};
