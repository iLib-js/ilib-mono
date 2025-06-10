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

var Xliff = require("./Xliff.js");
var webOSXliff = require("./webOSXliff.js");

var xliffClasses = {
    webOS: webOSXliff,
    standard: Xliff,
    default: Xliff
};

/**
 * @class Create the right type of xliff subclass
 * for the given arguments.
 *
 * @param {Object} props properties of the resource to be passed to the
 * actual resource subclass' constructor
 */
var XliffFactory = function(props) {
    var style = XliffFactory.availableStyles.includes(props.style) ? props.style : XliffFactory.defaultStyle;
    var XliffClass = xliffClasses[style];

    return XliffClass ? new XliffClass(props) : undefined;
};

XliffFactory.availableStyles = ['default', 'standard', 'webOS'];
XliffFactory.defaultStyle = 'standard';

/**
 * Get the available xliff style
 *
 * @returns {Array.<Object>} Returns a list of possible XLIFF styles.
 */
XliffFactory.getAllStyles = function () {
    return this.availableStyles;
}

module.exports = XliffFactory;