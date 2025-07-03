/*
 * XliffSplit.ts - split Xliff files by language or project
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
const path = require('path');
const log4js = require('log4js');

const logger = log4js.getLogger('loctool.lib.XliffSplit');

/**
 * Settings for xliff split operation
 */
export interface XliffSplitSettings {
    infiles: string[];
    splittype: string;
    xliffVersion?: number;
    xliffStyle?: string;
    targetDir?: string;
}

/**
 * Translation unit structure
 */
export interface TranslationUnit {
    project: string;
    targetLocale: string;
    sourceLocale?: string;
    key: string;
    source: string;
    target?: string;
    state?: string;
    comment?: string;
    [key: string]: any;
}

/**
 * Xliff file cache structure
 */
export interface XliffCache {
    [key: string]: any;
}

/**
 * Parse xliff 1.x version and distribute translation units
 * @private
 * @param superset the translation units to distribute
 * @param settings the split settings
 * @returns cache of xliff files organized by key
 */
function parse1(superset: TranslationUnit[], settings: XliffSplitSettings): XliffCache {
    const cache: XliffCache = {};
    
    for (let i = 0; i < superset.length; i++) {
        const unit = superset[i];
        logger.trace('unit to distribute is ' + JSON.stringify(unit, undefined, 4));
        
        const key = (settings.splittype === 'language') ? unit.targetLocale : unit.project;
        logger.trace('key is ' + key);
        
        let file = cache[key];
        if (!file) {
            const config = new Config({
                xliffVersion: settings.xliffVersion || 1.2,
                xliffStyle: settings.xliffStyle || 'standard'
            });
            
            file = cache[key] = createXliff(config);
            (file as any).path = './' + key + '.xliff';
            logger.trace('new xliff is ' + JSON.stringify(file, undefined, 4));
        }
        
        file.addTranslationUnit(unit);
    }
    
    return cache;
}

/**
 * Parse xliff 2.x version and distribute translation units
 * @private
 * @param superset the translation units to distribute
 * @param settings the split settings
 * @returns cache of xliff files organized by key
 */
function parse2(superset: TranslationUnit[], settings: XliffSplitSettings): XliffCache {
    const cache: XliffCache = {};
    const output = settings.targetDir || '.';
    
    if (!fs.existsSync(output)) {
        fs.mkdirSync(output);
    }

    if (settings.splittype === 'language') {
        logger.error('When xliff is 2.x case, it is only valid a split by project with a merged xliff form.\n');
        return cache;
    }

    for (let i = 0; i < superset.length; i++) {
        const unit = superset[i];
        logger.trace('unit(xliff 2.0) to distribute is ' + JSON.stringify(unit, undefined, 4));
        
        const key = unit.project;
        let file = cache[key];
        const prjXliffPath = path.join(output, key);

        if (!file) {
            const config = new Config({
                xliffVersion: settings.xliffVersion || 2.0,
                xliffStyle: settings.xliffStyle || 'standard'
            });
            
            file = cache[key] = createXliff(config);
            (file as any).path = path.join(prjXliffPath, unit.targetLocale + '.xliff');
            logger.trace('new xliff is ' + JSON.stringify(file, undefined, 4));
        }
        
        file.addTranslationUnit(unit);
    }
    
    return cache;
}

/**
 * Split the given xliff files by language or project
 *
 * @param settings an object containing the current settings
 * @returns the translation units in xliff
 */
export function xliffSplit(settings: XliffSplitSettings): TranslationUnit[] {
    if (!settings) return [];
    
    const superset: TranslationUnit[] = [];

    settings.infiles.forEach(function (file) {
        logger.info('Reading ' + file + ' ...');
        if (fs.existsSync(file)) {
            const data = fs.readFileSync(file, 'utf-8');
            const config = new Config({
                xliffVersion: settings.xliffVersion || 1.2,
                xliffStyle: settings.xliffStyle || 'standard'
            });
            
            const xliff = createXliff(config);
            xliff.parse(data);
            superset.push(...xliff.getTranslationUnits());
        } else {
            logger.warn('Could not open input file ' + file);
        }
    });
    
    return superset;
}

/**
 * Split the given xliff files by language or project
 *
 * @param superset the translation units in this xliff
 * @param settings an object containing the current settings
 * @returns classified set by given type
 */
export function distribute(superset: TranslationUnit[], settings: XliffSplitSettings): XliffCache {
    if (!superset) return {};
    
    logger.info('Distributing resources ...');

    if ((settings.xliffVersion || 1.2) < 2) {
        return parse1(superset, settings);
    } else {
        return parse2(superset, settings);
    }
}

/**
 * Write the resource file out to disk.
 * @param cache classified set by given type
 * @returns true if it is done
 */
export function write(cache: XliffCache): boolean {
    for (const key in cache) {
        const file = cache[key];
        const xliffDir = path.dirname((file as any).path || file.getPath());
        
        if (!fs.existsSync(xliffDir)) {
            fs.mkdirSync(xliffDir, { recursive: true });
        }
        
        logger.info('Writing ' + ((file as any).path || file.getPath()) + ' ...');
        const content = file.generate ? file.generate({}) : file.serialize();
        fs.writeFileSync((file as any).path || file.getPath(), content, 'utf-8');
    }
    
    return true;
}

/**
 * Main XliffSplit class with static methods for compatibility
 */
export class XliffSplit {
    /**
     * Split the given xliff files by language or project
     * @param settings an object containing the current settings
     * @returns the translation units in xliff
     */
    static split(settings: XliffSplitSettings): TranslationUnit[] {
        return xliffSplit(settings);
    }

    /**
     * Distribute translation units by type
     * @param superset the translation units to distribute
     * @param settings the split settings
     * @returns classified set by given type
     */
    static distribute(superset: TranslationUnit[], settings: XliffSplitSettings): XliffCache {
        return distribute(superset, settings);
    }

    /**
     * Write the split files to disk
     * @param cache classified set by given type
     * @returns true if successful
     */
    static write(cache: XliffCache): boolean {
        return write(cache);
    }
}

// Default export for compatibility with existing code
export default function(settings: XliffSplitSettings): TranslationUnit[] {
    return xliffSplit(settings);
} 