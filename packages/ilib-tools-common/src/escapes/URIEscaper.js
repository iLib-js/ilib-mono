/*
 * URIEscaper.js - class that escapes and unescapes strings in uri files
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

/**
 * @class Escaper for Java
 */
class URIEscaper extends Escaper {
    /**
     * @constructor
     */
    constructor() {
        super("uri");
        this.name = "uri-escaper";
        this.description = "Escapes and unescapes strings in URIs and URLs";
    }

    /**
     * @override
     */
    escape(string) {
        // rely on nodejs to do the right thing
        return encodeURI(string);
    }

    /**
     * @override
     */
    unescape(string) {
        // rely on nodejs to do the right thing
        return decodeURI(string);
    }
}

export default URIEscaper;