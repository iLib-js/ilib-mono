/*
 * InitCommand.ts - command to initialize a new loctool project
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
import { BaseCommand } from './ICommand';
import { Config } from './Config';

/**
 * Command to initialize the current directory as a loctool project
 * and write out a project.json file.
 */
export class InitCommand extends BaseCommand {
    readonly name = 'init';
    readonly description = 'Initialize the current directory as a loctool project and write out a project.json file';

    constructor(config: Config) {
        super(config);
    }

    async run(): Promise<void> {
        const logger = this.getLogger();
        
        try {
            logger.info("loctool - extract strings from source code and localize them.");
            logger.info("Command: init");
            
            const info = this.collectInfo();
            const projectConfig = this.createProjectConfig(info);
            const outputFile = path.join(this.config.rootDir, "project.json");
            
            fs.writeFileSync(outputFile, JSON.stringify(projectConfig, undefined, 4) + '\n', "utf-8");
            logger.info("Wrote file " + outputFile);
            
        } catch (error) {
            logger.error("Error during project initialization:", error);
            throw error;
        }
    }

    /**
     * Collect project information from user input
     */
    private collectInfo(): any {
        const readline = require("readline-sync");
        
        console.log("loctool v2.12.0 Copyright (c) 2016-2017, 2019-2025, HealthTap, Inc. and JEDLSoft");
        console.log("Project Initialize");

        const settings: any = {
            rootDir: '.',
            pseudoLocale: "zxx-XX"
        };

        const answer1 = readline.question('Full name of this project: ');
        settings.name = answer1;
        settings.id = answer1;

        const answer2 = readline.question('Type of this project (web, swift, iosobjc, android, custom) [custom]: ');
        switch (answer2) {
            case 'web':
            case 'swift':
            case 'iosobjc':
            case 'android':
                settings.projectType = answer2;
                break;
            default:
            case 'custom':
                settings.projectType = 'custom';
                settings.plugins = [
                    "javascript",
                    "javascript-resource",
                    "ghfm"
                ];
                settings.resourceDirs = {
                    "javascript": "target",
                    "md": "target"
                };
                break;
        }

        const answer3 = readline.question('Source locale [en-US]: ');
        settings.sourceLocale = answer3 || "en-US";

        return settings;
    }

    /**
     * Create the project configuration object
     */
    private createProjectConfig(info: any): any {
        return {
            name: info.name,
            id: info.id || info.name,
            sourceLocale: info.sourceLocale,
            pseudoLocale: info.pseudoLocale,
            resourceDirs: info.resourceDirs,
            includes: [],
            excludes: [
                ".git",
                ".github",
                "test",
                "node_modules",
                "package.json",
                "project.json"
            ],
            settings: {
                locales: ["en-GB", "de-DE", "fr-FR", "it-IT", "es-ES", "pt-BR", "ja-JP", "zh-Hans-CN", "ko-KR"]
            },
            projectType: info.projectType,
            plugins: info.plugins
        };
    }
} 