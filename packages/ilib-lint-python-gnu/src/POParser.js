/*
 * POParser.js - a parser for PO files
 *
 * Copyright © 2022-2024 JEDLSoft
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
import path from 'node:path';

import { Parser, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';
import {
    ResourceString,
    ResourceArray,
    ResourcePlural,
    TranslationSet,
    getLocaleFromPath,
    makeDirs,
    containsActualText,
    objectMap
} from 'ilib-tools-common';

import POFileType from 'ilib-loctool-po';

const typeToClass = {
    'array': ResourceArray,
    'plural': ResourcePlural,
    'string': ResourceString
};

const shimAPI = {
    newResource: function(props) {
        const Clazz = typeToClass[props.resType] || ResourceString;
        return new Clazz(props);
    },
    newTranslationSet: function(sourceLocale) {
        return new TranslationSet(sourceLocale);
    },
    utils: {
        getLocaleFromPath,
        makeDirs,
        containsActualText,
        objectMap
    },
    isPseudoLocale: locale => {
        return false;
    },
    newXliff: options => {
        return undefined;
    },
    getPseudoBundle: (locale, filetype, project) => {
        return undefined;
    },
    getResourceFileType: (type) => {
        return undefined;
    },
    getLogger: function(category) {
        let logger = {};
        [ 'Trace', 'Debug', 'Info', 'Warn', 'Error', 'Fatal', 'Mark' ].forEach((level) => {
            logger[level.toLowerCase()] = () => {};
            logger[`is${level}Enabled`] = () => false;
        });
        return logger;
    }
};

// this is a shim between the loctool plugin ilib-loctool-po and this ilib-lint plugin
class ShimProject {
    constructor(options) {
        this.sourceLocale = options.sourceLocale;
        this.root = options.root;
        this.target = options.target;
        this.settings = options.settings;
    }

    getAPI() {
        return shimAPI;
    }

    getProjectId() {
        return "ilib-lint";
    }

    getSourceLocale() {
        return this.sourceLocale;
    }
};

class POParser extends Parser {
    constructor(options) {
        super(options);
        this.name = "parser-po";
        let projOptions = {
            sourceLocale: (options && options.sourceLocale) || "en-US",
            root: ".",
            target: ".",
            settings: {}
        };
        if (options && options.settings) {
            projOptions.settings.po = {
                mappings: {
                    "**/*.po": options && options.settings,
                    "**/*.pot": options && options.settings
                }
            };
        }
        const proj = new ShimProject(projOptions);
        this.potype = new POFileType(proj);
    }

    init() {
        console.log("POParser.init called");
    }

    getExtensions() {
        return [ "po", "pot" ];
    }

    parseData(data) {
    }

    getType() {
        return "resource";
    }

    /**
     * Parse the current file into an intermediate representation.
     * @param {SourceFile} sourceFile the file to parse
     */
    parse(sourceFile) {
        const pofile = this.potype.newFile(sourceFile.getPath());
        pofile.extract();
        this.ts = pofile.getTranslationSet();
        return [new IntermediateRepresentation({
            type: "resource",
            ir: this.ts.getAll(),
            sourceFile
        })];
    }
}

export default POParser;
