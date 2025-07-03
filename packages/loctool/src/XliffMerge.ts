/*
 * XliffMerge.ts - Merge multiple xliff files into one
 *
 * Copyright © 2020, JEDLSoft
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

import { createXliff } from './XliffFactory';
import { Config } from './Config';

// Declare require for Node.js modules
declare const require: any;
const fs = require('fs');
const log4js = require('log4js');

const logger = log4js.getLogger('loctool.lib.XliffMerge');

/**
 * Settings for xliff merge operation
 */
export interface XliffMergeSettings {
    outfile: string;
    infiles: string[];
    xliffVersion?: number;
    xliffStyle?: string;
}

/**
 * Merge the given xliff files to the named outfile
 *
 * @param settings an object containing the current settings
 * @returns xliff file with data merged into one
 */
export function xliffMerge(settings: XliffMergeSettings): any {
    if (!settings) return null;

    const config = new Config({
        xliffVersion: settings.xliffVersion || 1.2,
        xliffStyle: settings.xliffStyle || 'standard'
    });

    const target = createXliff(config);
    (target as any).path = settings.outfile;

    settings.infiles.forEach(function (file) {
        if (fs.existsSync(file)) {
            logger.info('Merging ' + file + ' ...');
            const data = fs.readFileSync(file, 'utf-8');
            
            const xliff = createXliff(config);
            xliff.parse(data);
            
            const units = xliff.getTranslationUnits();
            units.forEach((unit: any) => {
                target.addTranslationUnit(unit);
            });
        } else {
            logger.warn('Could not open input file ' + file);
        }
    });

    return target;
}

/**
 * Write the resource file out to disk.
 *
 * @param xliff file with data merged into one
 * @returns true if it is done
 */
export function write(xliff: any): boolean {
    if (!xliff) return false;
    
    logger.info('Writing out ' + (xliff.path || xliff.getPath()) + '...');
    const content = xliff.generate ? xliff.generate({}) : xliff.serialize();
    fs.writeFileSync(xliff.path || xliff.getPath(), content, 'utf-8');
    
    return true;
}

/**
 * Main XliffMerge class with static methods for compatibility
 */
export class XliffMerge {
    /**
     * Merge the given xliff files
     * @param settings an object containing the current settings
     * @returns xliff file with data merged into one
     */
    static merge(settings: XliffMergeSettings): any {
        return xliffMerge(settings);
    }

    /**
     * Write the merged xliff file to disk
     * @param xliff the merged xliff file
     * @returns true if successful
     */
    static write(xliff: any): boolean {
        return write(xliff);
    }
}

// Default export for compatibility with existing code
export default function(settings: XliffMergeSettings): any {
    return xliffMerge(settings);
} 