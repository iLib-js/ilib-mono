/*
 * PropertiesIntermediateFile.ts - represents an intermediate file in Java Properties format
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

import { IIntermediateFile, IntermediateFileOptions } from './IIntermediateFile';

// Declare require for Node.js modules
declare const require: any;
const fs = require('fs');

/**
 * An intermediate file in Java Properties format that can read and write
 * .properties files containing translation resources.
 */
export class PropertiesIntermediateFile implements IIntermediateFile {
    public readonly path: string;
    private project: string;
    private sourceLocale: string;
    private targetLocale?: string;
    private datatype?: string;
    private contextInKey?: boolean;
    private resources: Map<string, any> = new Map();

    /**
     * Create a new Properties intermediate file
     * @param options options for the intermediate file
     */
    constructor(options: IntermediateFileOptions) {
        this.path = options.path;
        this.project = options.project;
        this.sourceLocale = options.sourceLocale;
        this.targetLocale = options.targetLocale;
        this.datatype = options.datatype;
        this.contextInKey = options.contextInKey;
    }

    /**
     * Read the Properties file and return the resources it contains
     * @returns a set containing the resources in the file
     * @throws {Error} if the file cannot be read
     */
    read(): any {
        if (!fs.existsSync(this.path)) {
            throw new Error(`File not found: ${this.path}`);
        }

        const data = fs.readFileSync(this.path, 'utf-8');
        
        try {
            const resources = this.parseProperties(data);
            const resourceArray = Array.from(resources.values());
            
            return {
                resources: resourceArray,
                size: () => resourceArray.length,
                getAll: () => resourceArray,
                add: (resource: any) => {
                    const key = resource.getKey ? resource.getKey() : resource.id;
                    resources.set(key, resource);
                    resourceArray.push(resource);
                },
                addAll: (newResources: any[]) => {
                    newResources.forEach((resource: any) => {
                        const key = resource.getKey ? resource.getKey() : resource.id;
                        resources.set(key, resource);
                        resourceArray.push(resource);
                    });
                }
            };
        } catch (error) {
            throw new Error(`Failed to parse Properties file ${this.path}: ${error}`);
        }
    }

    /**
     * Write the given resources to the Properties file
     * @param set the set of resources to write
     * @throws {Error} if the file cannot be written
     */
    write(set: any): void {
        try {
            const resources = set.getAll ? set.getAll() : (Array.isArray(set) ? set : []);
            const propertiesContent = this.generateProperties(resources);
            fs.writeFileSync(this.path, propertiesContent, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to write Properties file ${this.path}: ${error}`);
        }
    }

    /**
     * Parse a properties file content into resources
     * @param content the properties file content
     * @returns a map of resources keyed by their ID
     */
    private parseProperties(content: string): Map<string, any> {
        const resources = new Map<string, any>();
        const lines = content.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Skip empty lines and comments
            if (!line || line.startsWith('#') || line.startsWith('!')) {
                continue;
            }
            
            // Find the separator (= or :)
            const separatorIndex = this.findSeparator(line);
            if (separatorIndex === -1) {
                continue; // Skip lines without separators
            }
            
            const key = this.unescapePropertiesKey(line.substring(0, separatorIndex).trim());
            const value = this.unescapePropertiesValue(line.substring(separatorIndex + 1).trim());
            
            // Handle multi-line values (lines ending with backslash)
            let fullValue = value;
            while (fullValue.endsWith('\\') && i + 1 < lines.length) {
                i++;
                const nextLine = lines[i].trim();
                fullValue = fullValue.slice(0, -1) + nextLine;
            }
            
            // Create resource object
            const resource = {
                id: key,
                source: this.isSourceFile() ? fullValue : '',
                target: this.isSourceFile() ? '' : fullValue,
                sourceLocale: this.sourceLocale,
                targetLocale: this.targetLocale,
                project: this.project,
                state: fullValue ? 'translated' : 'new',
                datatype: this.datatype || 'plaintext',
                getKey: () => key,
                getSource: () => this.isSourceFile() ? fullValue : '',
                getTarget: () => this.isSourceFile() ? '' : fullValue,
                getSourceLocale: () => this.sourceLocale,
                getTargetLocale: () => this.targetLocale,
                getProject: () => this.project,
                getState: () => fullValue ? 'translated' : 'new',
                getDatatype: () => this.datatype || 'plaintext',
                getComment: () => '',
                getContext: () => this.contextInKey ? this.extractContext(key) : ''
            };
            
            resources.set(key, resource);
        }
        
        return resources;
    }

    /**
     * Generate properties file content from resources
     * @param resources the resources to convert
     * @returns the properties file content
     */
    private generateProperties(resources: any[]): string {
        const lines: string[] = [];
        
        // Add header comment
        lines.push(`# Generated by loctool`);
        lines.push(`# Project: ${this.project}`);
        lines.push(`# Source Locale: ${this.sourceLocale}`);
        if (this.targetLocale) {
            lines.push(`# Target Locale: ${this.targetLocale}`);
        }
        lines.push('');
        
        // Add resources
        for (const resource of resources) {
            const key = resource.getKey ? resource.getKey() : resource.id;
            const value = this.isSourceFile() 
                ? (resource.getSource ? resource.getSource() : resource.source)
                : (resource.getTarget ? resource.getTarget() : resource.target);
            
            if (key && value !== undefined) {
                const comment = resource.getComment ? resource.getComment() : resource.comment;
                if (comment) {
                    lines.push(`# ${comment}`);
                }
                
                const escapedKey = this.escapePropertiesKey(key);
                const escapedValue = this.escapePropertiesValue(value);
                lines.push(`${escapedKey}=${escapedValue}`);
                lines.push('');
            }
        }
        
        return lines.join('\n');
    }

    /**
     * Find the position of the key-value separator in a properties line
     * @param line the line to search
     * @returns the index of the separator, or -1 if not found
     */
    private findSeparator(line: string): number {
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '=' || char === ':') {
                // Check if it's escaped
                let backslashCount = 0;
                for (let j = i - 1; j >= 0 && line[j] === '\\'; j--) {
                    backslashCount++;
                }
                if (backslashCount % 2 === 0) {
                    return i; // Not escaped
                }
            }
        }
        return -1;
    }

    /**
     * Unescape a properties file key
     * @param key the escaped key
     * @returns the unescaped key
     */
    private unescapePropertiesKey(key: string): string {
        return key
            .replace(/\\:/g, ':')
            .replace(/\\=/g, '=')
            .replace(/\\\\/g, '\\')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t');
    }

    /**
     * Unescape a properties file value
     * @param value the escaped value
     * @returns the unescaped value
     */
    private unescapePropertiesValue(value: string): string {
        return value
            .replace(/\\\\/g, '\\')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
    }

    /**
     * Escape a properties file key
     * @param key the unescaped key
     * @returns the escaped key
     */
    private escapePropertiesKey(key: string): string {
        return key
            .replace(/\\/g, '\\\\')
            .replace(/:/g, '\\:')
            .replace(/=/g, '\\=')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');
    }

    /**
     * Escape a properties file value
     * @param value the unescaped value
     * @returns the escaped value
     */
    private escapePropertiesValue(value: string): string {
        return value
            .replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, (char) => {
                const hex = char.charCodeAt(0).toString(16);
                return `\\u${'0000'.substring(hex.length) + hex}`;
            });
    }

    /**
     * Extract context from a key if contextInKey is enabled
     * @param key the key to extract context from
     * @returns the extracted context or empty string
     */
    private extractContext(key: string): string {
        if (!this.contextInKey) return '';
        
        // Look for context separator patterns like "context:key" or "context.key"
        const contextSeparators = [':', '.', '_'];
        for (const separator of contextSeparators) {
            const index = key.indexOf(separator);
            if (index > 0) {
                return key.substring(0, index);
            }
        }
        
        return '';
    }

    /**
     * Determine if this is a source file based on locale
     * @returns true if this is a source locale file
     */
    private isSourceFile(): boolean {
        return !this.targetLocale || this.targetLocale === this.sourceLocale;
    }

    /**
     * Get the type of this intermediate file
     * @returns "properties"
     */
    getType(): string {
        return 'properties';
    }

    /**
     * Get the source locale for this file
     * @returns the source locale
     */
    getSourceLocale(): string {
        return this.sourceLocale;
    }

    /**
     * Get the target locale for this file
     * @returns the target locale, if any
     */
    getTargetLocale(): string | undefined {
        return this.targetLocale;
    }

    /**
     * Get the project name for this file
     * @returns the project name
     */
    getProject(): string {
        return this.project;
    }

    /**
     * Get the datatype for this file
     * @returns the datatype
     */
    getDatatype(): string | undefined {
        return this.datatype;
    }

    /**
     * Get whether context should be included in keys
     * @returns true if context should be included in keys
     */
    getContextInKey(): boolean | undefined {
        return this.contextInKey;
    }
} 