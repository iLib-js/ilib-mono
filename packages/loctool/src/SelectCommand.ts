/*
 * SelectCommand.ts - command to select translation units from xliff files
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
import { xliffSelect, write } from './XliffSelect';

// Declare require for Node.js modules
declare const require: any;
const fs = require('fs');

/**
 * Command to select translation units from input files using given criteria
 * and write them to the output file. All files must be xliff files.
 */
export class SelectCommand extends BaseCommand {
    readonly name = 'select';
    readonly description = 'Select translation units from the input files using the given criteria and write them to the output file. All files must be xliff files.';

    constructor(config: Config) {
        super(config);
    }

    async init(): Promise<void> {
        await super.init();
        
        // Validate required parameters
        if (!this.config.criteria) {
            throw new Error("Must specify selection criteria");
        }
        
        if (!this.config.outfile) {
            throw new Error("Must specify an output file");
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
            logger.info("Command: select");
            logger.info("Criteria: " + this.config.criteria);
            logger.info("Output file: " + this.config.outfile);
            logger.info("Input files: " + this.config.infiles!.join(", "));

            // Use the XliffSelect module
            
            // Create a settings object for XliffSelect
            const settings = {
                criteria: this.config.criteria!,
                outfile: this.config.outfile!,
                infiles: this.config.infiles!,
                id: this.config.id,
                xliffVersion: this.config.xliffVersion,
                xliffStyle: this.config.xliffStyle,
                extendedAttr: this.config.extendedAttr
            };

            // Perform the selection operation
            const selected = xliffSelect(settings);
            write(selected);
            
            logger.info("Selection operation completed successfully");
            
        } catch (error) {
            logger.error("Error during xliff selection:", error);
            throw error;
        }
    }
} 