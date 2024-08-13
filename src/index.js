#!/usr/bin/env node
/*
 * ilib-assemble.js - Scan an application looking for references to ilib
 * classes and then assembling the locale data for those classes into
 * files that can be included in webpack
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

import OptionsParser from 'options-parser';
import Locale from 'ilib-locale';
import { JSUtils, Utils } from 'ilib-common';
import fs from 'fs';
import path from 'path';
import json5 from 'json5';

import walk from './walk.js';
import scan from './scan.js';
import scanModule from './scanmodule.js';
import scanResources from './scanres.js';
import assembleilib from './legacyilibassemble.js';

const optionConfig = {
    help: {
        short: "h",
        help: "This help message",
        showHelp: {
            banner: 'Usage: ilib-assemble [-h] [options] outputPath [input_file_or_directory ...]',
            output: console.log
        }
    },
    compressed: {
        short: "c",
        flag: true,
        help: "Whether you want the output to be compressed/minified."
    },
    format: {
        short: "f",
        "default": "js",
        help: "What format do you want the output data to be in. Choices are 'cjs' for a commonjs file, 'js' for an ESM module, or 'json' for a plain json file. Default is 'js'. Note: ESM modules cannot be loaded synchronously with ilib-localedata."
    },
    locales: {
        short: "l",
        "default": "en-AU,en-CA,en-GB,en-IN,en-NG,en-PH,en-PK,en-US,en-ZA,de-DE,fr-CA,fr-FR,es-AR,es-ES,es-MX,id-ID,it-IT,ja-JP,ko-KR,pt-BR,ru-RU,tr-TR,vi-VN,zxx-XX,zh-Hans-CN,zh-Hant-HK,zh-Hant-TW,zh-Hans-SG",
        help: "Locales you want your webapp to support. Value is a comma-separated list of BCP-47 style locale tags. Default: the top 20 locales on the internet by traffic."
    },
    localefile: {
        short: "x",
        help: "Name a json file that contains an array that lists the Locales you want your webapp to support. The json should contain a `locales` property which is an array of BCP-47 style locale tags. No default."
    },
    module: {
        short: "m",
        multi: true,
        help: "Explicitly add the locale data for a module that is not otherwise mentioned in the source code. Parameter gives a relative path to the module, including the leading './'. Typically, this would be in ./node_modules, but it could be anywhere on disk. This option may be specified multiple times, once for each module to add. VAL is the name of the module to add."
    },
    quiet: {
        short: "q",
        flag: true,
        help: "Produce no progress output during the run, except for error messages."
    },
    resources: {
        short: "r",
        multi: true,
        help: "Include translated resource files in the output files such that they can be loaded with ilib-resbundle. The resource files should come from ilib's loctool or other such localization tool which produces a set of translated resource files. VAL is the path to the root of a resource file tree."
    },
    legacyilib: {
        short: "o",
        flag: true,
        help: "The flag to indicate assembe the legacy version of ilib."
    },
    ilibPath: {
        short: "i",
        help: "Specify the location where the legacy versin of ilib is installed."
    },
    ilibincPath: {
        short: "f",
        "default": "./src/ilib-assemble-inc.js",
        help: "Specify name of Javascript file to process."
    },
    outjsFileName: {
        short: "n",
        "default": "ilib-assemble.js",
        help: "Specify the resulting assembled output file name."
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

if (!options.opt.quiet) console.log("ilib-assemble - Copyright (c) 2022, 2024 JEDLsoft, All rights reserved.");

const outputPath = options.args[0];
let stat;
try {
    stat = fs.statSync(outputPath);
} catch (e) {}

if (!stat) {
    // file not found, so let's make it
    fs.mkdirSync(outputPath, { recursive: true });
    if (!options.opt.quiet) console.log(`Created output path: ${outputPath}`);
} else if (stat.errno) {
    console.log(`Could not access ${outputPath}`);
    console.log(stat);
    process.exit(2);
} else if (!stat.isDirectory()) {
    console.log(`${outputPath} is a file, not a directory.`);
    process.exit(3);
}

if (options.opt.localefile) {
    const json = json5.parse(fs.readFileSync(options.opt.localefile, "utf-8"));
    options.opt.locales = json.locales;
} else if (options.opt.locales) {
    options.opt.locales = options.opt.locales.split(/,/g);
}
// normalize the locale specs
options.opt.locales = options.opt.locales.map(spec => {
    let loc = new Locale(spec);
    if (!loc.getLanguage()) {
        loc = new Locale("und", loc.getRegion(), loc.getVariant(), loc.getScript());
    }
    return loc.getSpec();
});

if (!options.opt.legacyilib) {
    let paths = options.args.slice(1);
    if (paths.length === 0) {
        paths.push(".");
    }

    if (!options.opt.format) {
        options.opt.format = "js";
    }

    if (!options.opt.quiet) console.log(`Assembling data for locales: ${options.opt.locales.join(", ")}`);

    if (!options.opt.quiet) console.log(`\n\nScanning input paths: ${JSON.stringify(paths)}`);

    let files = [];

    paths.forEach((pathName) => {
        if (!options.opt.quiet) console.log(`  Scanning ${pathName} for Javascript files...`);
        files = files.concat(walk(pathName, options.opt));
    });

    let ilibModules = new Set();

    if (!options.opt.quiet) console.log(`\n\nScanning javascript files...`);

    files.forEach((file) => {
        if (!options.opt.quiet) console.log(`  ${file} ...`);
        scan(file, ilibModules);
    });

    if (options.opt.module) {
        options.opt.module.forEach(module => {
            if (!options.opt.quiet) console.log(`\nAdding module ${module} to the list of modules to search`);
            ilibModules.add((module[0] === '.') ? path.join(process.cwd(), module) : module);
        });
    }

    let localeData = {};

    if (!options.opt.quiet) console.log(`\n\nScanning ilib modules for locale data`);
    let promise = Promise.resolve(false);
    ilibModules.forEach((module) => {
        if (!options.opt.quiet) console.log(`  Scanning module ${module} ...`);
        promise = promise.then(result => {
            return scanModule(module, options.opt).then(data => {
                if (data && typeof(data) === "object") {
                    // merge in the sublocales separately
                    for (const sublocale in data) {
                        localeData = JSUtils.merge(localeData, data[sublocale], true);
                    }
                    return true;
                }
                return result;
            });
        });
    });


    if (!options.opt.quiet) {
        promise.then(result => {
            console.log(`\n\nScanning directories for resource files`);
        });
    }

    if (options.opt.resources) {
        options.opt.resources.forEach(resDir => {
            promise = promise.then(result => {
                if (!options.opt.quiet) console.log(`  ${resDir} ...`);
                return scanResources(resDir, options).then(data => {
                    // console.log(`Received data ${JSON.stringify(data, undefined, 4)}`);
                    if (data) {
                        localeData = JSUtils.merge(localeData, data, true);
                        return true;
                    }
                    return result;
                });
            });
        });
    }

    const spaces = "                                                                                                                 ";
    function indent(str, howMany) {
        return str.split(/\n/g).map(line => {
            return spaces.substring(0, howMany*4) + line;
        }).join("\n");
    };

    promise.then(result => {
        // console.log(`localeData is: ${JSON.stringify(localeData, undefined, 4)}`);

        let hadOutput = false;
        if (result) {
            if (!options.opt.quiet) console.log("\n\nWriting out data...");

            for (let i = 0; i < options.opt.locales.length; i++) {
                const locale = options.opt.locales[i];
                // assemble all the sublocales into a single file
                const sublocales = Utils.getSublocales(locale);
                const contents = {};
                sublocales.forEach((sublocale) => {
                    if (!JSUtils.isEmpty(localeData[sublocale])) {
                        contents[sublocale] = localeData[sublocale];
                    }
                });

                const outputName = path.join(outputPath, `${locale}.js`);
                let contentStr = options.opt.compressed ?
                    JSON.stringify(contents) :
                    JSON.stringify(contents, undefined, 4);
                switch (options.opt.format) {
                    case 'js':
                        contentStr =
                            "export default function getLocaleData() {\n" +
                            `    return ${indent(contentStr, 1)};\n` +
                            "};";
                        break;
                    case 'cjs':
                        contentStr = `module.exports = ${contentStr};`;
                        break;
                }
                if (contentStr.length) {
                    fs.writeFileSync(outputName, contentStr, "utf-8");
                    hadOutput = true;
                }
            }
            if (hadOutput) {
                if (!options.opt.quiet) console.log(`Done. Output is in ${outputPath}.`);
                return true;
            }
        }
        if (!options.opt.quiet) console.log("Done. No locale data found.");
    });

    } else {
        assembleilib(options);
    }
    console.log("DONE");