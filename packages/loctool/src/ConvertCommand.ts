/*
 * ConvertCommand.ts - command to convert between resource file formats
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
 * Command to convert input files to the output file format.
 * All files must be resource file types such as xliff, po, or properties.
 */
export class ConvertCommand extends BaseCommand {
    readonly name = 'convert';
    readonly description = 'Convert input files to the output file format. All files must be resource file types such as xliff, po, or properties.';

    constructor(config: Config) {
        super(config);
    }

    async init(): Promise<void> {
        await super.init();
        
        // Validate required parameters
        if (!this.config.outfile) {
            throw new Error("Must specify an output file name");
        }
        
        if (!this.config.infiles || this.config.infiles.length === 0) {
            throw new Error("Must specify at least one input file");
        }

        // Set default project id if not provided
        if (!this.config.id) {
            this.config.id = "convert";
        }
    }

    async run(): Promise<void> {
        const logger = this.getLogger();
        
        try {
            logger.info("loctool - extract strings from source code and localize them.");
            logger.info("Command: convert");
            logger.info("Output file: " + this.config.outfile);
            logger.info("Input files: " + this.config.infiles!.join(", "));

            // Import the convert module
            const fileConvert = require("../lib/convert.js");
            
            // Create a settings object for conversion
            const settings = {
                outfile: this.config.outfile,
                infiles: this.config.infiles,
                id: this.config.id,
                onlyTranslated: this.config.onlyTranslated,
                segmentation: this.config.segmentation,
                targetLocale: this.config.targetLocale
            };

            // Perform the conversion
            fileConvert(settings);
            
            logger.info("Conversion completed successfully");
            
        } catch (error) {
            logger.error("Error during file conversion:", error);
            throw error;
        }
    }
} 