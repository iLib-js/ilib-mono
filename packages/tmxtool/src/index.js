#!/usr/bin/env node
/*
 * tmxtool.js - Scan an application looking for references to ilib
 * classes and then assembling the locale data for those classes into
 * files that can be included in webpack
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

import OptionsParser from 'options-parser';
import Locale from 'ilib-locale';
import fs from 'fs';
import path from 'path';
import TMX from 'ilib-tmx';

import diff from './diff.js';
import merge from './merge.js';

const optionConfig = {
    help: {
        short: "h",
        help: "This help message",
        showHelp: {
            banner: 
`Usage: tmxtool [-h] [options] command [input_file_or_directory ...]
  Commands:
    diff [-o outputFile] file.tmx file.tmx
    merge [-o outputFile] file.tmx [file.tmx...]
    split [-O outputDir] splittype file.tmx
      type is one of:
        target   - split by target locale
        source   - split by source locale
        datatype - split by data type
        segtype  - split by segmentation type
`,
            output: console.log
        }
    },
    compressed: {
        short: "c",
        flag: false,
        help: "Whether you want output files to be compressed/minified."
    },
    locales: {
        short: "l",
        "default": "en-AU,en-CA,en-GB,en-IN,en-NG,en-PH,en-PK,en-US,en-ZA,de-DE,fr-CA,fr-FR,es-AR,es-ES,es-MX,id-ID,it-IT,ja-JP,ko-KR,pt-BR,ru-RU,tr-TR,vi-VN,zxx-XX,zh-Hans-CN,zh-Hant-HK,zh-Hant-TW,zh-Hans-SG",
        help: "Locales you want your webapp to support. Value is a comma-separated list of BCP-47 style locale tags. Default: the top 20 locales on the internet by traffic."
    },
    outputfile: {
        short: "o",
        help: "path to the output file"
    },
    quiet: {
        short: "q",
        flag: true,
        help: "Produce no progress output during the run, except for error messages."
    },
};

const options = OptionsParser.parse(optionConfig);

if (options.args.help) {
    OptionsParser.help(optionConfig, optionConfig.help.showHelp);
    process.exit(0);
}

if (options.args.length < 1) {
    console.log("Error: missing command parameter");
    OptionsParser.help(optionConfig, optionConfig.help.showHelp);
    process.exit(1);
}
const command = options.args[0];

if (["diff", "split", "merge"].indexOf(command) < 0) {
    console.log(`Error: unknown command parameter: ${command}`);
    OptionsParser.help(optionConfig, optionConfig.help.showHelp);
    process.exit(2);
}

let file1, file2, file, files, splittype;

// validate arguments
switch (command) {
    case 'diff':
        if (options.args.length < 3) {
            console.log("Error: diff command requires two file names as parameters");
            OptionsParser.help(optionConfig, optionConfig.help.showHelp);
            process.exit(3);
        }
        file1 = options.args[1];
        file2 = options.args[2];
        if (!fs.existsSync(file1)) {
            console.log(`Error: file ${file1} does not exist.`);
            OptionsParser.help(optionConfig, optionConfig.help.showHelp);
            process.exit(4);
        }
        if (!fs.existsSync(file2)) {
            console.log(`Error: file ${file2} does not exist.`);
            OptionsParser.help(optionConfig, optionConfig.help.showHelp);
            process.exit(5);
        }
        break;

    case 'split':
        if (options.args.length < 2) {
            console.log("Error: split command requires a split type parameter");
            OptionsParser.help(optionConfig, optionConfig.help.showHelp);
            process.exit(6);
        }
        splittype = options.args[1];
        if (["target", "source", "datatype", "segtype"].indexOf(splittype) < 0) {
            console.log(`Error: unknown splittype parameter: ${splittype}`);
            OptionsParser.help(optionConfig, optionConfig.help.showHelp);
            process.exit(7);
        }
        if (options.args.length < 3) {
            console.log("Error: split command requires a tmx input file parameter");
            OptionsParser.help(optionConfig, optionConfig.help.showHelp);
            process.exit(8);
        }
        file = options.args[2];
        if (!fs.existsSync(file)) {
            console.log(`Error: file ${file} does not exist.`);
            OptionsParser.help(optionConfig, optionConfig.help.showHelp);
            process.exit(9);
        }
        break;

    case 'merge':
        if (options.args.length < 3) {
            console.log("Error: merge command requires at least two file name parameters");
            OptionsParser.help(optionConfig, optionConfig.help.showHelp);
            process.exit(10);
        }
        files = options.args.slice(1);
        files.forEach(file => {
            if (!fs.existsSync(file)) {
                console.log(`Error: file ${file} does not exist.`);
                OptionsParser.help(optionConfig, optionConfig.help.showHelp);
                process.exit(11);
            }
        });
        break;
}

if (!options.opt.quiet) console.log("tmxtool - Copyright (c) 2023 Box, Inc., All rights reserved.");

// normalize the locale specs
options.opt.locales = options.opt.locales.split(/,/g).map(spec => {
    let loc = new Locale(spec);
    if (!loc.getLanguage()) {
        loc = new Locale("und", loc.getRegion(), loc.getVariant(), loc.getScript());
    }
    return loc.getSpec();
});

switch (command) {
    case 'diff':
        diff(options, file1, file2);
        break;

    case 'split':
        console.log("Split function is not implemented yet");
        break;

    case 'merge':
        merge(options, files);
        break;
}
