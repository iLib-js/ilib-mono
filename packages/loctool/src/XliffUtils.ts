/*
 * XliffUtils.ts - utility functions for working with xliff files
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
import { createXliff, IXliff } from './XliffFactory';

// Declare module types for Node.js modules  
declare const require: any;

const fs = require('fs');
const path = require('path');

/**
 * Utility class for working with xliff files
 */
export class XliffUtils {
    /**
     * Create an xliff instance based on project configuration
     */
    static createXliffFromConfig(config: Config): IXliff {
        return createXliff(config);
    }

    /**
     * Load and parse an xliff file
     */
    static async loadXliffFile(filePath: string, config: Config): Promise<IXliff> {
        if (!fs.existsSync(filePath)) {
            throw new Error(`Xliff file not found: ${filePath}`);
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const xliff = createXliff(config);
        
        try {
            await xliff.parse(content);
            return xliff;
        } catch (error) {
            throw new Error(`Failed to parse xliff file ${filePath}: ${error}`);
        }
    }

    /**
     * Save an xliff instance to a file
     */
    static async saveXliffFile(xliff: IXliff, filePath: string, data?: any): Promise<void> {
        try {
            const content = xliff.generate(data);
            const dir = path.dirname(filePath);
            
            // Ensure directory exists
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(filePath, content, 'utf8');
        } catch (error) {
            throw new Error(`Failed to save xliff file ${filePath}: ${error}`);
        }
    }

    /**
     * Convert translation resources to xliff format
     */
    static convertResourcesToXliff(resources: any[], config: Config): IXliff {
        const xliff = createXliff(config);
        
        if (config.sourceLocale && config.targetLocale) {
            xliff.setLocales(config.sourceLocale, config.targetLocale);
        }

        resources.forEach(resource => {
            xliff.addTranslationUnit({
                id: resource.getKey ? resource.getKey() : resource.id,
                source: resource.getSource ? resource.getSource() : resource.source,
                target: resource.getTarget ? resource.getTarget() : resource.target,
                state: resource.getState ? resource.getState() : resource.state,
                note: resource.getComment ? resource.getComment() : resource.note,
                comment: resource.getComment ? resource.getComment() : resource.comment
            });
        });

        return xliff;
    }

    /**
     * Merge multiple xliff files into one
     */
    static async mergeXliffFiles(inputFiles: string[], outputFile: string, config: Config): Promise<void> {
        const mergedXliff = createXliff(config);
        
        for (const inputFile of inputFiles) {
            try {
                const xliff = await this.loadXliffFile(inputFile, config);
                const units = xliff.getTranslationUnits();
                
                units.forEach(unit => {
                    mergedXliff.addTranslationUnit(unit);
                });
                
                // Use locales from the first file that has them set
                if (!mergedXliff.getSourceLocale() || mergedXliff.getSourceLocale() === 'en-US') {
                    const sourceLocale = xliff.getSourceLocale();
                    const targetLocale = xliff.getTargetLocale();
                    if (sourceLocale && targetLocale) {
                        mergedXliff.setLocales(sourceLocale, targetLocale);
                    }
                }
            } catch (error) {
                throw new Error(`Failed to merge xliff file ${inputFile}: ${error}`);
            }
        }

        await this.saveXliffFile(mergedXliff, outputFile);
    }

    /**
     * Split an xliff file by target language
     */
    static async splitXliffByLanguage(inputFile: string, outputDir: string, config: Config): Promise<string[]> {
        const xliff = await this.loadXliffFile(inputFile, config);
        const units = xliff.getTranslationUnits();
        const outputFiles: string[] = [];
        
        // Group units by target locale
        const unitsByLocale: Record<string, any[]> = {};
        
        units.forEach(unit => {
            const locale = unit.targetLocale || xliff.getTargetLocale() || 'unknown';
            if (!unitsByLocale[locale]) {
                unitsByLocale[locale] = [];
            }
            unitsByLocale[locale].push(unit);
        });

        // Create separate xliff files for each locale
        for (const locale in unitsByLocale) {
            const localeUnits = unitsByLocale[locale];
            const localeXliff = createXliff(config);
            localeXliff.setLocales(xliff.getSourceLocale(), locale);
            
            localeUnits.forEach((unit: any) => {
                localeXliff.addTranslationUnit(unit);
            });
            
            const outputFile = path.join(outputDir, `${locale}.xliff`);
            await this.saveXliffFile(localeXliff, outputFile);
            outputFiles.push(outputFile);
        }

        return outputFiles;
    }

    /**
     * Split an xliff file by project
     */
    static async splitXliffByProject(inputFile: string, outputDir: string, config: Config): Promise<string[]> {
        const xliff = await this.loadXliffFile(inputFile, config);
        const units = xliff.getTranslationUnits();
        const outputFiles: string[] = [];
        
        // Group units by project (assuming project info is in the note or a custom attribute)
        const unitsByProject: Record<string, any[]> = {};
        
        units.forEach(unit => {
            const project = unit.project || this.extractProjectFromUnit(unit) || 'default';
            if (!unitsByProject[project]) {
                unitsByProject[project] = [];
            }
            unitsByProject[project].push(unit);
        });

        // Create separate xliff files for each project
        for (const project in unitsByProject) {
            const projectUnits = unitsByProject[project];
            const projectXliff = createXliff(config);
            projectXliff.setLocales(xliff.getSourceLocale(), xliff.getTargetLocale());
            
            projectUnits.forEach((unit: any) => {
                projectXliff.addTranslationUnit(unit);
            });
            
            const outputFile = path.join(outputDir, `${project}.xliff`);
            await this.saveXliffFile(projectXliff, outputFile);
            outputFiles.push(outputFile);
        }

        return outputFiles;
    }

    /**
     * Extract project information from a translation unit
     */
    private static extractProjectFromUnit(unit: any): string | undefined {
        // Try to extract project from various possible locations
        if (unit.project) return unit.project;
        if (unit.note && typeof unit.note === 'string') {
            const projectMatch = unit.note.match(/project[:\s]+([^\s,]+)/i);
            if (projectMatch) return projectMatch[1];
        }
        if (unit.id && typeof unit.id === 'string') {
            const parts = unit.id.split(':');
            if (parts.length > 1) return parts[0];
        }
        return undefined;
    }

    /**
     * Validate an xliff file
     */
    static async validateXliffFile(filePath: string, config: Config): Promise<{ valid: boolean; errors: string[] }> {
        const errors: string[] = [];
        
        try {
            const xliff = await this.loadXliffFile(filePath, config);
            const units = xliff.getTranslationUnits();
            
            // Basic validation
            if (!xliff.getSourceLocale()) {
                errors.push('Missing source locale');
            }
            
            if (units.length === 0) {
                errors.push('No translation units found');
            }
            
            units.forEach((unit, index) => {
                if (!unit.id) {
                    errors.push(`Unit ${index + 1}: Missing ID`);
                }
                if (!unit.source) {
                    errors.push(`Unit ${index + 1}: Missing source text`);
                }
            });
            
        } catch (error) {
            errors.push(`Parse error: ${error}`);
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
} 