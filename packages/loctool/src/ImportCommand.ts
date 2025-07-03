/*
 * ImportCommand.ts - command to import translated strings (not yet implemented)
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
 * Command to import all the translated strings in the given xliff files.
 * Note: This command is not yet implemented in the original loctool.
 */
export class ImportCommand extends BaseCommand {
    readonly name = 'import';
    readonly description = 'Import all the translated strings in the given xliff files (not yet implemented)';

    constructor(config: Config) {
        super(config);
    }

    async init(): Promise<void> {
        await super.init();
        
        // Validate required parameters
        if (!this.config.infiles || this.config.infiles.length === 0) {
            throw new Error("Must specify at least one input path to import");
        }
    }

    async run(): Promise<void> {
        const logger = this.getLogger();
        
        logger.info("loctool - extract strings from source code and localize them.");
        logger.info("Command: import");
        logger.info("Input files: " + this.config.infiles!.join(", "));
        logger.warn("Import command is not yet implemented");
        
        throw new Error("Import command is not yet implemented");
    }
} 