/*
 * XliffFactory.js - class that creates the right type of xliff subclass
 * for the given arguments
 *
 * Copyright © 2025, JEDLSoft
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

import { Xliff } from "ilib-xliff";
import { webOSXliff } from "ilib-xliff-webos";

const xliffClasses = {
    'webOS': webOSXliff,
    'standard': Xliff,
    'default': Xliff,
    '1.2': Xliff,
    '2.0': Xliff,
    '1': Xliff,
    '2': Xliff
};

/**
 * Factory function that creates an instance of an XLIFF class based on the provided style.
 *
 * @function
 * @param {Object} props properties of the xliff file to be passed to the
 * actual resource subclass constructor
 * @param {string} [props.style] the xliff format style
 * @param {string} [props.version] the xliff format version
 * 
 * @returns {(Xliff|undefined)} An instance of the corresponding XLIFF class, or `undefined` if the style is invalid.
 */
function XliffFactory(props = {}) {
    const {style, version} = props;
    let key;

    if (style && xliffClasses[style]) {
        key = style; //'style' has a higher priority than 'version' because version 1.0 is not supported for the 'webOS' style.
    } else if (version && xliffClasses[version]) {
        key = version;
    } else {
        key = 'default';
    }
    /*let style = props && XliffFactory.availableStyles.includes(props.style)
        ? props.style
        : XliffFactory.defaultStyle;
    */
    //let version = props && props.version ? props.version : '1.2';
    let XliffClass = xliffClasses[key];
    return XliffClass ? new XliffClass(props) : undefined;
}

XliffFactory.availableStyles = ['default', 'standard', 'webOS', '1.2', '2.0', '1', '2'];
XliffFactory.defaultStyle = 'standard';


/**
 * Get the available xliff styles
 *
 * @returns {Array.<String>} Returns an array of possible XLIFF styles.
 */
XliffFactory.getAllStyles = function () {
    return this.availableStyles;
}

export default XliffFactory;