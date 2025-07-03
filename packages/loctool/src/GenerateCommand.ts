/*
 * GenerateCommand.ts - command to generate resources without scanning sources
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

import { BaseCommand } from './ICommand';
import { Config } from './Config';

/**
 * Command to generate resources without scanning sources.
 * This is similar to the localize command, but will not first read the source files
 * to find the strings to localize. Instead, all translation units in the xliff files
 * that have translations will be output to the resource files regardless if they are
 * used or not.
 */
export class GenerateCommand extends BaseCommand {
    readonly name = 'generate';
    readonly description = 'Generate resources without scanning sources. This is similar to the localize command, but will not first read the source files to find the strings to localize.';

    constructor(config: Config) {
        super(config);
    }

    async run(): Promise<void> {
        const logger = this.getLogger();
        
        try {
            logger.info("loctool - extract strings from source code and localize them.");
            logger.info("Command: generate");

            // Import the required modules
            const ProjectFactory = require("../lib/ProjectFactory.js");
            const GenerateModeProcess = require("../lib/GenerateModeProcess.js");
            
            // Create a project using the settings
            const project = ProjectFactory.newProject(this.config, this.config);
            
            // Run the generate mode process
            GenerateModeProcess(project);
            
            logger.info("Generate operation completed successfully");
            
        } catch (error) {
            logger.error("Error during generate operation:", error);
            throw error;
        }
    }
} 