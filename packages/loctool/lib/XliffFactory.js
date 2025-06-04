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

var log4js = require("log4js");
var logger = log4js.getLogger("loctool.lib.XliffFactory");

var Xliff = require("./Xliff.js");
var webOSXliff = require("./webOSXliff.js");
/**
 * @class Create the right type of xliff subclass
 * for the given arguments.
 *
 * @param {Object} props properties of the resource to be passed to the
 * actual resource subclass' constructor
 */
var XliffFactory = function(props) {
    var style = XliffFactory.availableStyles.includes(props.xliffStyle) ? props.xliffStyle : XliffFactory.defaultStyle;

    switch (style) {
        case 'webOS':
            return new webOSXliff(props);
        case 'standard':
        case 'default':
            return new Xliff(props);
    }
    return undefined;
};

XliffFactory.availableStyles = ['default', 'standard', 'webOS'];
XliffFactory.defaultStyle = 'standard';

XliffFactory.getAllStyles = function () {
    return ['default', 'standard', 'webOS'];
}

module.exports = XliffFactory;