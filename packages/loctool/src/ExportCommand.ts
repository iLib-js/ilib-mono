/*
 * ExportCommand.ts - command to export strings (not yet implemented)
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
 * Command to export all the new strings to an xliff or a set of xliff files.
 * Note: This command is not yet implemented in the original loctool.
 */
export class ExportCommand extends BaseCommand {
    readonly name = 'export';
    readonly description = 'Export all the new strings to an xliff or a set of xliff files (not yet implemented)';

    constructor(config: Config) {
        super(config);
    }

    async run(): Promise<void> {
        const logger = this.getLogger();
        
        logger.info("loctool - extract strings from source code and localize them.");
        logger.info("Command: export");
        logger.warn("Export command is not yet implemented");
        
        throw new Error("Export command is not yet implemented");
    }
} 