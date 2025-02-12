/*
 * Escaper.js - class that escapes and unescapes strings
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
import JavaEscaper from "./escapes/JavaEscaper.js";
import JavascriptEscaper from "./escapes/JavascriptEscaper.js";
import RegexBasedEscaper from "./escapes/RegexBasedEscaper.js";

const escaperCache = {
};

/**
 * Return an Escaper instance for the given style. The style must be one of the
 * following:
 * <ul>
 * <li>xml - escape for XML</li>
 * <li>html - escape for HTML</li>
 * <li>json - escape for JSON</li>
 * <li>js - escape for JavaScript</li>
 * <li>java - escape for Java</li>
 * <li>kotlin - escape for Kotlin</li>
 * <li>php - escape for PHP</li>
 * <li>smarty - escape for Smarty templates</li>
 * <li>python - escape for Python</li>
 * <li>Swift - escape for Swift</li>
 * <li>url - escape for URLs and URIs</li>
 * <li>c# - escape for C#</li>
 * <li>regexp - escape for regular expressions</li>
 * </ul>
 * @param {string} style the style to use to determine how to escape
 * @returns {Escaper} a new Escaper instance, or undefined if the style
 * is not recognized
 */
function escaperFactory(style) {
    switch (style) {
        case 'java':
            if (!escaperCache[style]) {
                escaperCache[style] = new JavaEscaper();
            }
            break;

        case 'js':
            if (!escaperCache[style]) {
                escaperCache[style] = new JavascriptEscaper();
            }
            break;

        case 'php':
            if (!escaperCache[style]) {
                escaperCache[style] = new RegexBasedEscaper("php");
            }
            break;
    }
    return escaperCache[style];
}

export default escaperFactory;