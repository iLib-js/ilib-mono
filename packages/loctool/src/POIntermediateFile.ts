/*
 * POIntermediateFile.ts - represents an intermediate file in PO format
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
 * An intermediate file in PO (Portable Object) format that can read and write
 * PO files containing translation resources.
 */
export class POIntermediateFile implements IIntermediateFile {
    public readonly path: string;
    private po: any;
    private project: string;
    private sourceLocale: string;
    private targetLocale?: string;
    private datatype?: string;
    private contextInKey?: boolean;

    /**
     * Create a new PO intermediate file
     * @param options options for the intermediate file
     */
    constructor(options: IntermediateFileOptions) {
        this.path = options.path;
        this.project = options.project;
        this.sourceLocale = options.sourceLocale;
        this.targetLocale = options.targetLocale;
        this.datatype = options.datatype;
        this.contextInKey = options.contextInKey;

        // Import PO library from ilib-po
        try {
            const PO = require('ilib-po');
            const POFile = PO.POFile;
            
            this.po = new POFile({
                sourceLocale: this.sourceLocale,
                targetLocale: this.targetLocale,
                projectName: this.project,
                datatype: this.datatype,
                contextInKey: this.contextInKey,
                pathName: this.path
            });
        } catch (error) {
            throw new Error(`Failed to initialize PO file: ${error}`);
        }
    }

    /**
     * Read the PO file and return the resources it contains
     * @returns a set containing the resources in the file
     * @throws {Error} if the file cannot be read
     */
    read(): any {
        if (!fs.existsSync(this.path)) {
            throw new Error(`File not found: ${this.path}`);
        }

        const data = fs.readFileSync(this.path, 'utf-8');
        
        try {
            // Parse the PO content
            const resources = this.po.parse(data);
            
            // Convert to simple set-like structure
            const resourceArray = resources && resources.size && resources.size() > 0 
                ? resources.getAll().map(this.convertResourceToLoctool)
                : [];
            
            return {
                resources: resourceArray,
                size: () => resourceArray.length,
                getAll: () => resourceArray,
                add: (resource: any) => resourceArray.push(resource),
                addAll: (resources: any[]) => resourceArray.push(...resources)
            };
        } catch (error) {
            throw new Error(`Failed to parse PO file ${this.path}: ${error}`);
        }
    }

    /**
     * Write the given resources to the PO file
     * @param set the set of resources to write
     * @throws {Error} if the file cannot be written
     */
    write(set: any): void {
        try {
            // Create a new set with converted resources
            const resources = set.getAll ? set.getAll() : (Array.isArray(set) ? set : []);
            const convertedResources = resources.map(this.convertResourceToCommon);
            
            // Create simple set structure for PO library
            const newSet = {
                resources: convertedResources,
                size: () => convertedResources.length,
                getAll: () => convertedResources,
                add: (resource: any) => convertedResources.push(resource),
                addAll: (resources: any[]) => convertedResources.push(...resources)
            };
            
            // Generate PO content
            const data = this.po.generate(newSet);
            fs.writeFileSync(this.path, data, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to write PO file ${this.path}: ${error}`);
        }
    }

    /**
     * Convert a resource from the common format to loctool format
     * @param resource the resource to convert
     * @returns the converted resource
     */
    private convertResourceToLoctool(resource: any): any {
        // Basic conversion - in a real implementation this would use the convert library
        return {
            getKey: () => resource.getKey ? resource.getKey() : resource.id,
            getSource: () => resource.getSource ? resource.getSource() : resource.source,
            getTarget: () => resource.getTarget ? resource.getTarget() : resource.target,
            getContext: () => resource.getContext ? resource.getContext() : resource.context,
            getComment: () => resource.getComment ? resource.getComment() : resource.comment,
            getState: () => resource.getState ? resource.getState() : resource.state,
            getSourceLocale: () => resource.getSourceLocale ? resource.getSourceLocale() : undefined,
            getTargetLocale: () => resource.getTargetLocale ? resource.getTargetLocale() : undefined
        };
    }

    /**
     * Convert a resource from loctool format to the common format
     * @param resource the resource to convert
     * @returns the converted resource
     */
    private convertResourceToCommon(resource: any): any {
        // Basic conversion - in a real implementation this would use the convert library
        return {
            id: resource.getKey ? resource.getKey() : resource.id,
            source: resource.getSource ? resource.getSource() : resource.source,
            target: resource.getTarget ? resource.getTarget() : resource.target,
            context: resource.getContext ? resource.getContext() : resource.context,
            comment: resource.getComment ? resource.getComment() : resource.comment,
            state: resource.getState ? resource.getState() : resource.state,
            sourceLocale: resource.getSourceLocale ? resource.getSourceLocale() : this.sourceLocale,
            targetLocale: resource.getTargetLocale ? resource.getTargetLocale() : this.targetLocale,
            getKey: () => resource.getKey ? resource.getKey() : resource.id,
            getSource: () => resource.getSource ? resource.getSource() : resource.source,
            getTarget: () => resource.getTarget ? resource.getTarget() : resource.target,
            getContext: () => resource.getContext ? resource.getContext() : resource.context,
            getComment: () => resource.getComment ? resource.getComment() : resource.comment,
            getState: () => resource.getState ? resource.getState() : resource.state,
            getSourceLocale: () => resource.getSourceLocale ? resource.getSourceLocale() : this.sourceLocale,
            getTargetLocale: () => resource.getTargetLocale ? resource.getTargetLocale() : this.targetLocale
        };
    }

    /**
     * Get the type of this intermediate file
     * @returns "po"
     */
    getType(): string {
        return 'po';
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