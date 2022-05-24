#!/usr/bin/env node
/*
 * ilib-assemble.js - Scan an application looking for references to ilib
 * classes and then assembling the locale data for those classes into
 * files that can be included in webpack
 *
 * Copyright © 2022 JEDLSoft
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

import OptionsParser from 'options-parser';
import Locale from 'ilib-locale';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

import walk from './walk.mjs';
import scan from './scan.mjs';

const optionConfig = {
    help: {
        short: "h",
        help: "This help message",
        showHelp: { 
            banner: 'Usage: ilib-assemble [-h] [options] outputPath [input_file_or_directory ...]',
            output: console.log
        }
    },
    format: {
        short: "f",
        "default": "js",
        help: "What format do you want the output data to be in. Choices are 'js' or 'json'. Default is 'js'."
    },
    compilation: {
        short: "c",
        flag: true,
        "default": "compressed",
        help: "Whether you want the output to be compressed with uglify-js."
    },
    locales: {
        short: "l",
        "default": [
            "en-AU", "en-CA", "en-GB", "en-IN", "en-NG", "en-PH",
            "en-PK", "en-US", "en-ZA", "de-DE", "fr-CA", "fr-FR",
            "es-AR", "es-ES", "es-MX", "id-ID", "it-IT", "ja-JP",
            "ko-KR", "pt-BR", "ru-RU", "tr-TR", "vi-VN", "zxx-XX",
            "zh-Hans-CN", "zh-Hant-HK", "zh-Hant-TW", "zh-Hans-SG"
        ],
        help: "Locales you want your webapp to support. Value is a comma-separated list of BCP-47 style locale tags. Default: the top 20 locales on the internet by traffic."
    },
    ilibRoot: {
        short: "i",
        varName: "ilibRoot",
        help: "Explicitly specify the location of the root of ilib. If not specified, this assemble will rely on node to find the ilib instance in the node_modules directory."
    }
};

const options = OptionsParser.parse(optionConfig);

if (options.args.length < 1) {
    console.log("Error: missing output path parameter");
    OptionsParser.help(optionConfig, {
        banner: 'Usage: ilib-assemble [-h] [options] outputPath [input_file_or_directory ...]',
        output: console.log
    });
    process.exit(1);
}

console.log("ilib-assemble - Copyright (c) 2022 JEDLsoft, All rights reserved.");

const outputPath = options.args[0];
const stat = fs.statSync(outputPath);
if (!stat) {
    // file not found, so let's make it
    mkdirp(outputPath);
    console.log(`Created output path: ${outputPath}`);
} else if (stat.errno) {
    console.log(`Could not access ${outputPath}`);
    console.log(stat);
    process.exit(2);
} else if (!stat.isDirectory()) {
    console.log(`${outputPath} is a file, not a directory.`);
    process.exit(3); 
}

let paths = options.args.slice(1);
if (paths.length === 0) {
    paths.push(".");
}

console.log(`Scanning input paths: ${JSON.stringify(paths)}`);

let files = [];

paths.forEach((pathName) => {
    console.log(`Scanning ${pathName} for Javascript files...`);
    files = files.concat(walk(pathName));
});

let ilibModules = new Set();

files.forEach((file) => {
    console.log(`Scanning file ${file} ...`);
    scan(file, ilibModules);
});

console.log(`Ilib modules found are: `);
for (let module of ilibModules) {
    console.log(module);
}