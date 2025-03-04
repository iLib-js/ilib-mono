/*
 * JsonEscaper.js - class that escapes and unescapes strings in json files
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

import Escaper from './Escaper.js';
import { unescapeUnicode, escapeJS, unescapeJS } from './EscapeCommon.js';

/**
 * @class Escaper for Java
 */
class JsonEscaper extends Escaper {
    /**
     * @constructor
     */
    constructor() {
        super("json");
        this.name = "json-escaper";
        this.description = "Escapes and unescapes strings in json files";
    }

    /**
     * @override
     */
    escape(string) {
        return escapeJS(string);
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        unescaped = unescapeUnicode(unescaped);
        unescaped = unescapeJS(unescaped);

        return unescaped;
    }
}

export default JsonEscaper;