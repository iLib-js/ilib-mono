/*
 * index.js - main program of ilib-lint plugin test
 *
 * Copyright © 2024 JEDLSoft
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

import { Plugin } from 'i18nlint-common';

import TestParser2 from './TestParser.js';
import TestRule from './TestRule.js';
import TestFormatter from './TestFormatter.js';
import TestFixer from './TestFixer.js';

class TestPlugin2 extends Plugin {
    constructor(options) {
        super(options);
    }

    init() {
        //console.log("TestPlugin2.init() called");
    }

    getExtensions() {
        //console.log("TestPlugin2.getExtensions() called");
        return [ "xyz" ];
    }

    getRules() {
        //console.log("TestPlugin2.getRules() called");
        return [ TestRule ];
    }

    getRuleSets() {
        return {
            "test": {
                "resource-test": true
            }
        };
    }

    getParsers() {
        //console.log("TestPlugin2.getParsers() called");
        return [ TestParser2 ];
    }

    getFormatters() {
        //console.log("TestPlugin2.getFormatters() called");
        return [ TestFormatter ];
    }

    getFixers() {
        return [ TestFixer ];
    }

}

export default TestPlugin2;