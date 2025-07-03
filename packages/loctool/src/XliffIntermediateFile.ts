/*
 * XliffIntermediateFile.ts - represents an intermediate file in XLIFF format
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
import { createXliff } from './XliffFactory';
import { Config } from './Config';

// Declare require for Node.js modules
declare const require: any;
const fs = require('fs');

/**
 * An intermediate file in XLIFF format that can read and write XLIFF files
 * containing translation resources.
 */
export class XliffIntermediateFile implements IIntermediateFile {
    public readonly path: string;
    private xliff: any;
    private project: string;
    private sourceLocale: string;
    private targetLocale?: string;
    private version?: string;
    private style?: string;
    private datatype?: string;
    private allowDups?: boolean;
    private contextInKey?: boolean;

    /**
     * Create a new XLIFF intermediate file
     * @param options options for the intermediate file
     */
    constructor(options: IntermediateFileOptions) {
        this.path = options.path;
        this.project = options.project;
        this.sourceLocale = options.sourceLocale;
        this.targetLocale = options.targetLocale;
        this.version = options.version;
        this.style = options.style;
        this.datatype = options.datatype;
        this.allowDups = options.allowDups;
        this.contextInKey = options.contextInKey;

        // Create xliff instance using the factory
        const config = new Config({
            xliffStyle: this.style || 'standard',
            xliffVersion: this.version ? parseFloat(this.version) : 1.2,
            sourceLocale: this.sourceLocale,
            targetLocale: this.targetLocale,
            id: this.project,
            allowDups: this.allowDups
        });

        this.xliff = createXliff(config);
        this.xliff.setLocales(this.sourceLocale, this.targetLocale || this.sourceLocale);
    }

    /**
     * Read the XLIFF file and return the resources it contains
     * @returns a set containing the resources in the file
     * @throws {Error} if the file cannot be read
     */
    read(): any {
        if (!fs.existsSync(this.path)) {
            throw new Error(`File not found: ${this.path}`);
        }

        const data = fs.readFileSync(this.path, 'utf-8');
        
        try {
            // Parse the XLIFF content
            const parsedData = this.xliff.parse(data);
            
            // Convert to TranslationSet-like structure
            const translationUnits = this.xliff.getTranslationUnits();
            
            // Create a simple set-like object for now
            // In a real implementation, this would return a proper TranslationSet
            return {
                resources: translationUnits,
                size: () => translationUnits.length,
                getAll: () => translationUnits,
                add: (resource: any) => translationUnits.push(resource),
                addAll: (resources: any[]) => translationUnits.push(...resources)
            };
        } catch (error) {
            throw new Error(`Failed to parse XLIFF file ${this.path}: ${error}`);
        }
    }

    /**
     * Write the given resources to the XLIFF file
     * @param set the set of resources to write
     * @throws {Error} if the file cannot be written
     */
    write(set: any): void {
        try {
            // Clear existing translation units
            this.xliff = this.xliff.constructor === Function 
                ? this.xliff 
                : createXliff(new Config({
                    xliffStyle: this.style || 'standard',
                    xliffVersion: this.version ? parseFloat(this.version) : 1.2,
                    sourceLocale: this.sourceLocale,
                    targetLocale: this.targetLocale
                }));

            this.xliff.setLocales(this.sourceLocale, this.targetLocale || this.sourceLocale);

            // Add all resources from the set
            const resources = set.getAll ? set.getAll() : (Array.isArray(set) ? set : []);
            
            resources.forEach((resource: any) => {
                this.xliff.addTranslationUnit({
                    id: resource.getKey ? resource.getKey() : resource.id,
                    source: resource.getSource ? resource.getSource() : resource.source,
                    target: resource.getTarget ? resource.getTarget() : resource.target,
                    state: resource.getState ? resource.getState() : resource.state,
                    note: resource.getComment ? resource.getComment() : resource.note,
                    comment: resource.getComment ? resource.getComment() : resource.comment,
                    context: resource.getContext ? resource.getContext() : resource.context,
                    datatype: this.datatype
                });
            });

            // Generate XLIFF content and write to file
            const xliffContent = this.xliff.generate({});
            fs.writeFileSync(this.path, xliffContent, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to write XLIFF file ${this.path}: ${error}`);
        }
    }

    /**
     * Get the type of this intermediate file
     * @returns "xliff"
     */
    getType(): string {
        return 'xliff';
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
     * Get the XLIFF version
     * @returns the version string
     */
    getVersion(): string | undefined {
        return this.version;
    }

    /**
     * Get the XLIFF style
     * @returns the style string
     */
    getStyle(): string | undefined {
        return this.style;
    }

    /**
     * Get whether duplicates are allowed
     * @returns true if duplicates are allowed
     */
    getAllowDups(): boolean | undefined {
        return this.allowDups;
    }
} 