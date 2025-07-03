/*
 * SplitCommand.ts - command to split xliff files
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
import { xliffSplit, distribute, write } from './XliffSplit';

// Declare require for Node.js modules
declare const require: any;
const fs = require('fs');

/**
 * Command to split xliff files by language or project.
 */
export class SplitCommand extends BaseCommand {
    readonly name = 'split';
    readonly description = 'Split the given xliff files by language or project';

    constructor(config: Config) {
        super(config);
    }

    async init(): Promise<void> {
        await super.init();
        
        // Validate required parameters
        if (!this.config.splittype) {
            throw new Error("Must specify a split type");
        }
        
        if (!this.config.infiles || this.config.infiles.length === 0) {
            throw new Error("Must specify at least one input file");
        }

        // Check that all input files exist
        for (const file of this.config.infiles) {
            if (!fs.existsSync(file)) {
                throw new Error("Could not access file " + file);
            }
        }
    }

    async run(): Promise<void> {
        const logger = this.getLogger();
        
        try {
            logger.info("loctool - extract strings from source code and localize them.");
            logger.info("Command: split");
            logger.info("Split type: " + this.config.splittype);
            logger.info("Input files: " + this.config.infiles!.join(", "));

            // Use the XliffSplit module
            
            // Create a settings object for XliffSplit
            const settings = {
                splittype: this.config.splittype!,
                infiles: this.config.infiles!,
                xliffVersion: this.config.xliffVersion,
                xliffStyle: this.config.xliffStyle,
                targetDir: this.config.targetDir
            };

            // Perform the split operation
            const superset = xliffSplit(settings);
            write(distribute(superset, settings));
            
            logger.info("Split operation completed successfully");
            
        } catch (error) {
            logger.error("Error during xliff split:", error);
            throw error;
        }
    }
} 