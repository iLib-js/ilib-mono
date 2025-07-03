#!/usr/bin/env node
/*
 * index.ts - main entry point for loctool
 *
 * Copyright © 2025 HealthTap, Inc.
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

import * as fs from 'fs';
import * as path from 'path';
import { Config } from './Config';
import { CommandFactory } from './CommandFactory';

let exitValue = 0;

function getVersion(): string {
    try {
        const packagePath = path.join(__dirname, '../package.json');
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return `loctool v${pkg.version} Copyright (c) 2016-2017, 2019-2025, HealthTap, Inc., JEDLSoft, and Box, Inc.`;
    } catch (error) {
        return "loctool v2.12.0 Copyright (c) 2016-2017, 2019-2025, HealthTap, Inc., JEDLSoft, and Box, Inc.";
    }
}

function usage(): void {
    console.log(getVersion());
    console.log(
        "Usage: loctool [-l locales] [-f filetype] [-t dir]\n" +
        "               [-x dir] [-2hinopqsv] [command [command-specific-arguments]]\n" +
        "Extract localizable strings from the source code.\n\n" +
        "-2\n" +
        "  Use xliff 2.0 format files instead of the default xliff 1.2\n" +
        "-h or --help\n" +
        "  this help. Use loctool [command] --help for help for a particular command.\n" +
        "-i or --identify\n" +
        "  Identify resources where possible by marking up the translated files with \n" +
        "  the resource key.\n" +
        "-l or --locales\n" +
        "  Restrict operation to only the given locales. Locales should be given as\n" +
        "  a comma-separated list of BCP-47 locale specs. By default, this tool\n" +
        "  will operate with all locales that are available in the translations.\n" +
        "--localeMap\n" +
        "  Map input locales to different ones in the output. The format of the parameter\n" +
        "  is a comma-separated list of mappings where each mapping is a BCP-47 specifier\n" +
        "  of the source locale, a colon, and the BCP-47 specifier of the target locale.\n" +
        "  eg. 'da:da-DK,no:nb-NO,en:en-GB'\n" +
        "--localeInherit\n" +
        "  Map locales to follow different locale inheritance rules than the default. By default, a locale inherits\n" +
        "  translations from the locale with the language only, and then from the root (en-US -> en -> root). With this\n" +
        "  option, you can specify that a locale inherits from a different locale first.\n" +
        "  The value of the parameter is a comma-separated list of mappings where each mapping is a BCP-47\n" +
        "  specifier of the source locale, a colon, and the BCP-47 specifier of the target locale.\n" +
        "  eg. 'en-AU:en-GB' (en-AU inherits translations from en-GB)\n" +
        "--projectId\n" +
        "  Specify the default name of the project if not specified otherwise.\n" +
        "--projectType\n" +
        "  The type of project, which affects how source files are read and resource files are written. Default: web \n" +
        "--plugins\n" +
        "  plugins to use that handle various file types in your project. The parameter should be a\n" +
        "  comma-separated list of plugin names.\n" +
        "-q or --quiet\n" +
        "  Quiet mode. Only print banners and any errors/warnings.\n" +
        "--root dir\n" +
        "  directory containing the git projects with the source code.\n" +
        "  Default: current dir.\n" +
        "-s or --silent\n" +
        "  Silent mode. Don't ever print anything on the stdout. Instead, just exit with\n" +
        "  the appropriate exit code.\n" +
        "--sourceLocale\n" +
        "   Default locale of source string. (Default is en-US) \n" +
        "-t or --target\n" +
        "  Write all output to the given target dir instead of in the source dir.\n" +
        "--targetLocale\n" +
        "  Set the target locale for a convert action for those resource file types that\n" +
        "  are single locale.\n" +
        "-v or --version\n" +
        "  Print the current loctool version and exit\n" +
        "-r or --translations\n" +
        "  Specify a dir or comma-separated array of dirs where the translation files live. The files\n" +
        "  maybe in xliff or po or pot file format. Default: \".\"\n" +
        "--noxliffDups\n" +
        "  Do not allow duplicated strings in extracted xliff file. (Default is 'true') \n" +
        "command\n" +
        "  a command to execute. This is one of:\n" +
        "    init, localize, split, merge, generate, convert, select\n" +
        "    Use loctool [command] --help to see help for a particular command.\n"
    );
    process.exit(0);
}

function printVersion(): void {
    console.log(getVersion());
    process.exit(0);
}

/**
 * Parse command-line arguments and return a Config object
 */
function parseCommandLine(argv: string[]): Config {
    const config = new Config();
    const options: string[] = [];

    for (let i = 0; i < argv.length; i++) {
        const val = argv[i];

        if (val === "-h" || val === "--help") {
            config.help = true;
        } else if (val === "-2") {
            config.xliffVersion = 2;
        } else if (val === "-p" || val === "--pull") {
            config.pull = true;
        } else if (val === "-l" || val === "--locales") {
            if (i + 1 < argv.length && argv[i + 1]) {
                config.locales = argv[++i].split(",");
            }
        } else if (val.toLowerCase() === "--localemap") {
            if (i + 1 < argv.length && argv[i + 1]) {
                const mappings = argv[++i].split(",");
                mappings.forEach(mapping => {
                    const parts = mapping.split(":");
                    if (parts && parts.length > 1) {
                        config.localeMap[parts[0]] = parts[1];
                    }
                });
            }
        } else if (val.toLowerCase() === "--localeinherit") {
            if (i + 1 < argv.length && argv[i + 1]) {
                const inheritList = argv[++i].split(",");
                inheritList.forEach(list => {
                    const parts = list.split(":");
                    if (parts && parts.length > 1) {
                        config.localeInherit[parts[0]] = parts[1];
                    }
                });
            }
        } else if (val === "-n" || val === "--pseudo") {
            config.nopseudo = false;
        } else if (val === "--intermediateFormat") {
            if (i + 1 < argv.length && argv[i + 1] && argv[i + 1][0] !== "-") {
                if (argv[i + 1] === "xliff" || argv[i + 1] === "po") {
                    config.intermediateFormat = argv[++i];
                } else {
                    console.error("Error: --intermediateFormat option requires a format argument to be 'xliff' or 'po'.");
                    usage();
                }
            } else {
                console.error("Error: --intermediateFormat option requires a format argument to follow it.");
                usage();
            }
        } else if (val === "-o" || val === "--oldhaml") {
            config.oldHamlLoc = true;
        } else if (val === "-i" || val === "--identify") {
            config.identify = true;
        } else if (val === "-q" || val === "--quiet") {
            config.quiet = true;
        } else if (val === "-s" || val === "--silent") {
            config.silent = true;
        } else if (val === "-f" || val === "--filetype") {
            if (i + 1 < argv.length && argv[i + 1]) {
                const types = argv[++i].split(",");
                config.fileTypes = {};
                types.forEach(type => {
                    config.fileTypes![type] = true;
                });
            }
        } else if (val === "--projectId") {
            config.id = argv[++i];
        } else if (val === "--projectType") {
            config.projectType = argv[++i];
        } else if (val === "--plugins") {
            if (i + 1 < argv.length && argv[i + 1]) {
                config.plugins = argv[++i].split(",");
            }
        } else if (val === "--resourceFileTypes") {
            config.resourceFileTypes = {};
            if (i + 1 < argv.length && argv[i + 1]) {
                const types = argv[++i].split(",");
                types.forEach(type => {
                    const resType = type.split("=");
                    config.resourceFileTypes![resType[0]] = resType[1];
                });
            }
        } else if (val === "--resourceFileNames") {
            config.resourceFileNames = {};
            if (i + 1 < argv.length && argv[i + 1]) {
                const types = argv[++i].split(",");
                types.forEach(type => {
                    const resType = type.split("=");
                    config.resourceFileNames![resType[0]] = resType[1];
                });
            }
        } else if (val === "--resourceDirs") {
            config.resourceDirs = {};
            if (i + 1 < argv.length && argv[i + 1]) {
                const types = argv[++i].split(",");
                types.forEach(type => {
                    const resType = type.split("=");
                    config.resourceDirs![resType[0]] = resType[1];
                });
            }
        } else if (val === "--sourceLocale") {
            config.sourceLocale = argv[++i];
        } else if (val === "-t" || val === "--target") {
            if (i + 1 < argv.length && argv[i + 1] && argv[i + 1][0] !== "-") {
                config.targetDir = argv[++i];
            } else {
                console.error("Error: -t (--target) option requires a directory name argument to follow it.");
                usage();
            }
        } else if (val === "-v" || val === "--version") {
            config.version = true;
        } else if (val === "-x" || val === "--xliffs" || val === "-r" || val === "--translations") {
            if (i + 1 < argv.length && argv[i + 1] && argv[i + 1][0] !== "-") {
                config.translationsDir = argv[++i].split(/,/g);
            } else {
                console.error("Error: -r (--translations) option requires a directory name argument to follow it.");
                usage();
            }
        } else if (val === "-z" || val === "--xliffsOut") {
            if (i + 1 < argv.length && argv[i + 1] && argv[i + 1][0] !== "-") {
                config.xliffsOut = argv[++i];
            } else {
                console.error("Error: -z (--xliffsOut) option requires a directory name argument to follow it.");
                usage();
            }
        } else if (val === "--xliffStyle") {
            const candidates = ["standard", "custom"];
            if (i + 1 < argv.length && candidates.indexOf(argv[i + 1]) !== -1) {
                config.xliffStyle = argv[++i];
            }
        } else if (val === "--noxliffDups") {
            config.allowDups = false;
        } else if (val === "--segmentation") {
            const candidates = ["paragraph", "sentence"];
            if (i + 1 < argv.length && candidates.indexOf(argv[i + 1]) !== -1) {
                config.segmentation = argv[++i];
            }
        } else if (val === "--targetLocale") {
            config.targetLocale = argv[++i];
        } else if (val === "--localizeOnly") {
            config.localizeOnly = true;
        } else if (val === "--onlyTranslated") {
            config.onlyTranslated = true;
        } else if (val === "--exclude") {
            if (i + 1 < argv.length && argv[i + 1]) {
                const excludeList = argv[++i].split(",");
                config.excludes = [...new Set([...config.excludes, ...excludeList])];
            }
        } else if (val === "--convertPlurals") {
            config.convertPlurals = true;
        } else if (val === "--extendedAttr") {
            if (i + 1 < argv.length && argv[i + 1]) {
                const attr = argv[++i].split("=");
                if (attr.length === 2) {
                    config.extendedAttr = config.extendedAttr || {};
                    config.extendedAttr[attr[0]] = attr[1];
                } else {
                    console.error("Error: --extendedAttr option requires a name=value argument to follow it.");
                    usage();
                }
            }
        } else {
            options.push(val);
        }
    }

    // Handle command and its arguments
    const command = options.length > 2 ? options[2] : "localize";
    config.mode = command;
    config.command = command;

    switch (command) {
        case "localize":
        default:
            if (options.length > 3) {
                config.rootDir = options[3];
            }
            break;
        case "export":
            config.outfile = options.length > 3 ? options[3] : undefined;
            break;
        case "import":
            if (options.length > 3) {
                config.infiles = options.slice(3);
            } else {
                console.error("Error: must specify at least one input path to import.");
                usage();
            }
            break;
        case "split":
            if (options.length < 5) {
                console.error("Error: must specify a split type and at least one input file.");
                usage();
            }
            config.splittype = options[3];
            config.infiles = options.slice(4);
            break;
        case "merge":
            if (options.length < 5) {
                console.error("Error: must specify an output file name and at least one input file.");
                usage();
            }
            config.outfile = options[3];
            config.infiles = options.slice(4);
            break;
        case "convert":
            if (options.length < 5) {
                console.error("Error: must specify an output file name and at least one input file.");
                usage();
            }
            config.outfile = options[3];
            config.infiles = options.slice(4);
            break;
        case "select":
            if (options.length < 5) {
                console.error("Error: must specify selection criteria, an output file, and at least one input file.");
                usage();
            }
            config.criteria = options[3];
            config.outfile = options[4];
            config.infiles = options.slice(5);
            break;
    }

    return config;
}

/**
 * Setup logging based on config options
 */
function setupLogging(config: Config): void {
    const log4js = require('log4js');
    
    // Configure log4js
    log4js.configure(path.join(__dirname, '../log4js.json'));
    
    const logger = log4js.getLogger("loctool.main");
    
    if (config.silent) {
        logger.level = 'OFF';
    } else if (config.quiet) {
        logger.level = 'error';
    }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
    try {
        // Parse command-line arguments
        const config = parseCommandLine(process.argv);

        // Handle help and version flags first
        if (config.help) {
            usage();
            return;
        }

        if (config.version) {
            printVersion();
            return;
        }

        // Setup logging
        setupLogging(config);

        // Get the command name
        const commandName = config.command || 'localize';

        // Check if command exists
        if (!CommandFactory.isCommandAvailable(commandName)) {
            console.error(`Error: Unknown command: ${commandName}`);
            console.error(`Available commands: ${CommandFactory.getAvailableCommands().join(', ')}`);
            exitValue = 1;
            return;
        }

        // Create and run the command
        const command = CommandFactory.createCommand(commandName, config);
        await command.init();
        await command.run();

    } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : String(error));
        if (error instanceof Error && error.stack) {
            console.error(error.stack);
        }
        exitValue = 2;
    }
}

// Run the main function and handle exit
main().then(() => {
    const log4js = require('log4js');
    log4js.shutdown(() => {
        process.exit(exitValue);
    });
}).catch((error) => {
    console.error("Fatal error:", error);
    process.exit(2);
});
