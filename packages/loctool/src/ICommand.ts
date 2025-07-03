/*
 * ICommand.ts - interface for loctool commands
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

import { Config } from './Config';

/**
 * Interface that all loctool commands must implement.
 * This provides a consistent structure for command execution.
 */
export interface ICommand {
    /**
     * The name of the command
     */
    readonly name: string;

    /**
     * A brief description of what the command does
     */
    readonly description: string;

    /**
     * Asynchronous initialization method that performs any necessary setup
     * before the command can be executed.
     * 
     * @returns Promise that resolves when initialization is complete
     */
    init(): Promise<void>;

    /**
     * Execute the command with the provided configuration.
     * 
     * @returns Promise that resolves when the command execution is complete
     */
    run(): Promise<void>;
}

/**
 * Abstract base class that provides common functionality for commands
 */
export abstract class BaseCommand implements ICommand {
    protected config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    abstract readonly name: string;
    abstract readonly description: string;

    /**
     * Default implementation of init - subclasses can override if needed
     */
    async init(): Promise<void> {
        // Validate configuration
        this.config.validate();
    }

    abstract run(): Promise<void>;

    /**
     * Helper method to get the logger
     */
    protected getLogger() {
        const log4js = require('log4js');
        return log4js.getLogger(`loctool.command.${this.name}`);
    }
} 