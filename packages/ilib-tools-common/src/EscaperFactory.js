/*
 * EscaperFactory.js - factory function that returns escaper instances
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
import CSharpEscaper from "./escapes/CSharpEscaper.js";
import JavaEscaper from "./escapes/JavaEscaper.js";
import JavascriptEscaper from "./escapes/JavascriptEscaper.js";
import JsonEscaper from "./escapes/JsonEscaper.js";
import RegexBasedEscaper from "./escapes/RegexBasedEscaper.js";
import PHPEscaper from "./escapes/PHPEscaper.js";
import ScalaEscaper from "./escapes/ScalaEscaper.js";
import SmartyEscaper from "./escapes/SmartyEscaper.js";
import PythonEscaper from "./escapes/PythonEscaper.js";
import SwiftEscaper from "./escapes/SwiftEscaper.js";
import URIEscaper from "./escapes/URIEscaper.js";

const escaperCache = {};

/**
 * Return an Escaper instance for the given style. The style must be one of the
 * following:
 * <ul>
 * <li>csharp - escape for C#</li>
 * <li>csharp-raw - escape for C# raw strings</li>
 * <li>csharp-verbatim - escape for C# verbatim strings</li>
 * <li>java - escape for Java</li>
 * <li>java-raw - escape for JSON raw strings</li>
 * <li>js - escape for JavaScript</li>
 * <li>javascript-template - escape for JavaScript template strings</li>
 * <li>json - escape for JSON</li>
 * <li>kotlin - escape for Kotlin</li>
 * <li>kotlin-raw - escape for Kotlin raw strings</li>
 * <li>php - escape for PHP (default, same as php-double)</li>
 * <li>php-double - escape for double-quoted PHP strings</li>
 * <li>php-single - escape for single-quoted PHP strings</li>
 * <li>php-heredoc - escape for PHP heredoc strings</li>
 * <li>php-nowdoc - escape for PHP nowdoc strings</li>
 * <li>python - escape for Python regular strings (default)</li>
 * <li>python-raw - escape for Python raw strings</li>
 * <li>python-byte - escape for Python byte strings</li>
 * <li>python-multi - escape for Python multi-line strings</li>
 * <li>regexp - escape for regular expressions</li>
 * <li>scala - escape for Scala regular strings</li>
 * <li>scala-raw - escape for Scala raw strings</li>
 * <li>scala-triple - escape for Scala triple-quoted strings</li>
 * <li>scala-char - escape for Scala character literals</li>
 * <li>smarty - escape for Smarty templates (default, same as smarty-double)</li>
 * <li>smarty-double - escape for double-quoted Smarty strings</li>
 * <li>smarty-single - escape for single-quoted Smarty strings</li>
 * <li>swift - escape for regular Swift strings</li>
 * <li>swift-multi - escape for Swift multi-line strings</li>
 * <li>swift-extended - escape for Swift extended strings</li>
 * <li>uri - escape for URLs and URIs</li>
 * <li>xml - escape for XML text, including HTML</li>
 * <li>xml-attr - escape for XML attributes, including HTML</li>
 * </ul>
 * @param {string} style the style to use to determine how to escape
 * @returns {Escaper} a new Escaper instance, or undefined if the style
 * is not recognized
 */
function escaperFactory(style) {
    if (style === "html") {
        style = "xml";
    }
    if (escaperCache[style]) {
        return escaperCache[style];
    }
    switch (style) {
        case 'csharp':
        case 'c#':
        case 'csharp-raw':
        case 'c#-raw':
        case 'csharp-verbatim':
        case 'c#-verbatim':
            escaperCache[style] = new CSharpEscaper(style);
            break;

        case 'kotlin':
        case 'kotlin-raw':
        case 'java':
        case 'java-raw':
            escaperCache[style] = new JavaEscaper(style);
            break;

        case 'json':
            escaperCache[style] = new JsonEscaper();
            break;

        case 'js':
        case 'js-template':
        case 'javascript':
        case 'javascript-template':
            escaperCache[style] = new JavascriptEscaper(style);
            break;

        case 'php':
        case 'php-double':
        case 'php-single':
        case 'php-heredoc':
        case 'php-nowdoc':
            escaperCache[style] = new PHPEscaper(style);
            break;

        case 'scala':
        case 'scala-raw':
        case 'scala-triple':
        case 'scala-char':
            escaperCache[style] = new ScalaEscaper(style);
            break;

        case 'smarty':
        case 'smarty-double':
        case 'smarty-single':
            escaperCache[style] = new SmartyEscaper(style);
            break;

        case 'python':
        case 'python-raw':
        case 'python-byte':
        case 'python-multi':
            escaperCache[style] = new PythonEscaper(style);
            break;

        case 'swift':
        case 'swift-multi':
        case 'swift-extended':
            escaperCache[style] = new SwiftEscaper(style);
            break;

        case 'uri':
        case 'url':
            escaperCache[style] = new URIEscaper(style);
            break;

        default:
            try {
                escaperCache[style] = new RegexBasedEscaper(style);
            } catch (e) {
                // if the style is not recognized, just return undefined
                return undefined;
            }
            break;
    }
    return escaperCache[style];
}

export default escaperFactory;