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

import { Plugin } from 'ilib-lint-common';

class TestPlugin extends Plugin {
    constructor(options) {
        super(options);
    }

    init() {
        //console.log("TestPlugin.init() called");
    }

    getExtensions() {
        //console.log("TestPlugin.getExtensions() called");
        return [ "xyz" ];
    }

    getRules() {
        //console.log("TestPlugin.getRules() called");
        return [ ];
    }

    getRuleSets() {
        return {
            "bad": "bad-bad-bad"
        };
    }

    getParsers() {
        //console.log("TestPlugin.getParsers() called");
        return [ ];
    }

    getFormatters() {
        //console.log("TestPlugin.getFormatters() called");
        return [ ];
    }

    getFixers() {
        return [ ];
    }

}

export default TestPlugin;