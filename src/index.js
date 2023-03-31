/*
 * index.js - main program of the React plugin
 *
 * Copyright © 2023 Box, Inc.
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

import JSXParser from './JSXParser.js';
import FormatjsPlurals from './rules/FormatjsPlurals.js';

class ReactPlugin extends Plugin {
    constructor(options) {
        super(options);
    }

    /** @override */
    init() {
        //console.log("ReactPlugin.init() called");
    }

    /** @override */
    getParsers() {
        return [ JSXParser ];
    }

    /** @override */
    getRules() {
        //console.log("ReactPlugin.getRules() called");
        return [ FormatjsPlurals ];
    }

    /** @override */
    getRuleSets() {
        return {
            "javascript": {
            }
        };
    }
}

export default ReactPlugin;