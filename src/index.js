/*
 * index.js - main program of ilib-lint
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

import fs from 'node:fs';
import path from 'node:path';

import OptionsParser from 'options-parser';
import Locale from 'ilib-locale';
import { JSUtils, Utils, Path } from 'ilib-common';
import json5 from 'json5';
import log4js from 'log4js';

import PluginManager from './PluginManager.js';
import walk from './walk.js';

const __dirname = Path.dirname(Path.fileUriToPath(import.meta.url));
log4js.configure(path.join(__dirname, '..', 'log4js.json'));

var logger = log4js.getLogger("ilib-lint.root");

const optionConfig = {
    help: {
        short: "h",
        help: "This help message",
        showHelp: {
            banner: 'Usage: ilib-lint [-h] [options] path [path ...]',
            output: logger.info
        }
    },
    config: {
        short: "c",
        help: "Give an explicit path to a configuration file instead of trying to find it in the current directory."
    },
    errorsOnly: {
        short: "e",
        flag: true,
        "default": false,
        help: "Only return errors and supress warnings"
    },
    formatter: {
        short: "f",
        "default": "ansi-console-formatter",
        help: "Name the formatter that should be used to format the output."
    },
    locales: {
        short: "l",
        "default": "en-AU,en-CA,en-GB,en-IN,en-NG,en-PH,en-PK,en-US,en-ZA,de-DE,fr-CA,fr-FR,es-AR,es-ES,es-MX,id-ID,it-IT,ja-JP,ko-KR,pt-BR,ru-RU,tr-TR,vi-VN,zxx-XX,zh-Hans-CN,zh-Hant-HK,zh-Hant-TW,zh-Hans-SG",
        help: "Locales you want your app to support. Value is a comma-separated list of BCP-47 style locale tags. Default: the top 20 locales on the internet by traffic."
    },
    sourceLocale: {
        short: "s",
        "default": "en-US",
        help: "Default locale used to interpret the strings in the source code or the source strings in resource files."
    },
    quiet: {
        short: "q",
        flag: true,
        help: "Produce no progress output during the run, except for error messages. Instead exit with a return value. Zero indicates no errors, and a positive exit value indicates errors."
    }
};

const options = OptionsParser.parse(optionConfig);

/*
if (options.args.length < 1) {
    logger.info("Error: missing path parameter");
    OptionsParser.help(optionConfig, {
        banner: 'Usage: iilib-lint [-h] [options] path [path ...]',
        output: logger.info
    });
    process.exit(1);
}
*/

if (!options.opt.quiet) logger.info("ilib-lint - Copyright (c) 2022 JEDLsoft, All rights reserved.");

let paths = options.args;
if (paths.length === 0) {
    paths.push(".");
}

if (options.opt.locales) {
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

// used if no explicit config is found or given
const defaultConfig = {
    "name": "ilib-lint",
    "locales": [
        "en-US",
        "de-DE",
        "ja-JP",
        "ko-KR"
    ],
    "paths": {
        "**/*.json": {
            "locales": [
                "en-US",
                "de-DE",
                "ja-JP"
            ]
        },
        "**/*.xliff": {
            "rules": {
                "resource-icu-plurals": true,
                "resource-quote-style": true,
                "resource-url-match": true,
                "resource-named-params": "localeOnly"
            }
        }
    },
    "excludes": [
        "**/.git",
        "**/node_modules",
        "**/.svn",
        "package.json",
        "package-lock.json"
    ]
};

let config = {};
if (options.opt.config) {
    if (!fs.existsSync(options.opt.config)) {
        logger.warn(`Config file ${options.opt.config} does not exist. Aborting...`);
        process.exit(2);
    }
    const data = fs.readFileSync(options.opt.config, "utf-8");
    config = json5.parse(data);
} else {
    config = defaultConfig;
}

if (!options.opt.quiet) logger.debug(`Scanning input paths: ${JSON.stringify(paths)}`);

// load and manage the plugins

const pluginMgr = new PluginManager();

let files = [];
paths.forEach(pathName => {
    files = files.concat(walk(pathName, {
        quiet: options.opt.quiet,
        config
    }));
});

const fm = pluginMgr.getFormatterManager();
const fmt = fm.get(options.opt.formatter);
if (!fmt) {
    logger.error(`Could not find formatter ${options.opt}. Aborting...`);
    process.exit(3);
}

// main loop
let exitValue = 0;
const pm = pluginMgr.getParserManager();
const ruleset = pluginMgr.getRuleSet();

files.forEach(file => {
    logger.trace(`Examining ${file.filePath}`);

    let parserClasses;

    let extension = path.extname(file.getFilePath());
    if (extension) {
        // remove the dot
        extension = extension.substring(1);
        parserClasses = pm.get(extension);
    }

    file.parse(parserClasses);
    const issues = file.findIssues(ruleset, options.opt.locales);
    issues.forEach(issue => {
        const str = fmt.format(issue);
        if (str) {
            if (issue.severity === "error") {
                logger.error(str);
                exitValue = 2;
            } else if (!options.opt.errorsOnly) {
                logger.warn(str);
                exitValue = Math.max(exitValue, 1);
            }
        }
    });
});

process.exit(exitValue);
