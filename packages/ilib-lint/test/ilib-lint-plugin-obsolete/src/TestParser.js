/*
 * TestParser.js - test an ilib-lint Parser plugin
 *
 * Copyright © 2022, 2024 JEDLSoft
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

import fs from 'node:fs';

import { Parser, IntermediateRepresentation } from 'i18nlint-common';
import json5 from 'json5';
import { ResourceString, TranslationSet } from 'ilib-tools-common';

class TestParser2 extends Parser {
    constructor(options) {
        super(options);
        this.name = "parser-ghi";
        this.description = "A test parser for ghi files, which are really just json files.";
        this.filePath = options && options.filePath;
    }

    init() {
        console.log("TestParser.init called");
    }

    getExtensions() {
        return [ "ghi" ];
    }

    parseData(data) {
        if (!data) {
            throw new Error("ilib-lint-plugin-obsolete: attempt to parse empty data");
        }
        const json = json5.parse(data);
        this.ts = new TranslationSet();

        for (let prop in json) {
            this.ts.add(new ResourceString({
                sourceLocale: "en-US",
                source: prop,
                reskey: prop,
                target: json[prop],
                resType: "x-ghi",
                pathName: this.filePath
            }));
        }
    }

    /**
     * Parse the current file into an intermediate representation.
     */
    parse() {
        // parse the def files as json for simplicity
        const data = fs.readFileSync(this.filePath, "utf-8");
        this.parseData(data);
        return [new IntermediateRepresentation({
            ir: this.ts.getAll(),
            filePath: this.filePath,
            locale: "en-US",
            type: "resource"
        })];
    }
}

export default TestParser2;
