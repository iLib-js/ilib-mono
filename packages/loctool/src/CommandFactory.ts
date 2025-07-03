/*
 * CommandFactory.ts - factory for creating and managing loctool commands
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

import { ICommand } from './ICommand';
import { Config } from './Config';
import { InitCommand } from './InitCommand';
import { LocalizeCommand } from './LocalizeCommand';
import { ExportCommand } from './ExportCommand';
import { ImportCommand } from './ImportCommand';
import { SplitCommand } from './SplitCommand';
import { MergeCommand } from './MergeCommand';
import { GenerateCommand } from './GenerateCommand';
import { ConvertCommand } from './ConvertCommand';
import { SelectCommand } from './SelectCommand';

/**
 * Factory class for creating and managing loctool commands.
 */
export class CommandFactory {
    private static commandConstructors: Map<string, new (config: Config) => ICommand> = new Map();

    static {
        // Initialize the command map
        this.commandConstructors.set('init', InitCommand);
        this.commandConstructors.set('localize', LocalizeCommand);
        this.commandConstructors.set('export', ExportCommand);
        this.commandConstructors.set('import', ImportCommand);
        this.commandConstructors.set('split', SplitCommand);
        this.commandConstructors.set('merge', MergeCommand);
        this.commandConstructors.set('generate', GenerateCommand);
        this.commandConstructors.set('convert', ConvertCommand);
        this.commandConstructors.set('select', SelectCommand);
    }

    /**
     * Create a command instance for the given command name.
     * 
     * @param commandName The name of the command to create
     * @param config The configuration object
     * @returns The command instance
     * @throws Error if the command is not found
     */
    static createCommand(commandName: string, config: Config): ICommand {
        const CommandConstructor = this.commandConstructors.get(commandName);
        
        if (!CommandConstructor) {
            throw new Error(`Unknown command: ${commandName}`);
        }
        
        return new CommandConstructor(config);
    }

    /**
     * Get a list of all available command names.
     * 
     * @returns Array of command names
     */
    static getAvailableCommands(): string[] {
        return Array.from(this.commandConstructors.keys());
    }

    /**
     * Check if a command is available.
     * 
     * @param commandName The name of the command to check
     * @returns True if the command is available, false otherwise
     */
    static isCommandAvailable(commandName: string): boolean {
        return this.commandConstructors.has(commandName);
    }

    /**
     * Get help information for all commands.
     * 
     * @param config A sample config object to create commands for help
     * @returns Map of command names to their descriptions
     */
    static getCommandHelp(config: Config): Map<string, string> {
        const help = new Map<string, string>();
        
        for (const [name, CommandConstructor] of this.commandConstructors) {
            try {
                const command = new CommandConstructor(config);
                help.set(name, command.description);
            } catch (error) {
                help.set(name, `Command ${name} (error getting description)`);
            }
        }
        
        return help;
    }

    /**
     * Register a new command with the factory.
     * 
     * @param name The name of the command
     * @param commandConstructor The constructor function for the command
     */
    static registerCommand(name: string, commandConstructor: new (config: Config) => ICommand): void {
        this.commandConstructors.set(name, commandConstructor);
    }

    /**
     * Unregister a command from the factory.
     * 
     * @param name The name of the command to unregister
     */
    static unregisterCommand(name: string): void {
        this.commandConstructors.delete(name);
    }
} 