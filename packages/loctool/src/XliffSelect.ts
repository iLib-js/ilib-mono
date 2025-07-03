/*
 * XliffSelect.ts - select translation units and write them to an output file
 *
 * Copyright © 2024 Box, Inc.
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

const logger = log4js.getLogger('loctool.lib.XliffSelect');

/**
 * Settings for xliff select operation
 */
export interface XliffSelectSettings {
    outfile: string;
    infiles: string[];
    criteria: string;
    xliffVersion?: number;
    xliffStyle?: string;
    extendedAttr?: Record<string, string>;
    id?: string;
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
    quantity?: string;
    ordinal?: number;
    extended?: Record<string, any>;
    [key: string]: any;
}

/**
 * Selection criteria structure
 */
export interface SelectionCriteria {
    maxunits?: number;
    maxsource?: number;
    maxtarget?: number;
    random?: boolean;
    category?: string;
    index?: number;
    fields?: Record<string, RegExp>;
}

/**
 * Random unit structure for shuffling
 */
interface RandomUnit {
    index: number;
    unit: TranslationUnit;
}

// Very simple tokenizer that only tokenizes by whitespace. This, of
// course, does not work so well in languages that do not use spaces
// between the words.
function wordCount(text: string): number {
    return text.split(/\s+/).filter(function(word) {
        return word.trim().length > 0;
    }).length;
}

/**
 * Return a hash for the translation unit. This is used to identify
 * translation units in the cache so we can avoid adding duplicates.
 * @private
 * @param unit the translation unit to hash
 * @returns the hash for the translation unit
 */
function tuHash(unit: TranslationUnit): string {
    return [unit.project, unit.targetLocale, unit.key].join('_');
}

/**
 * Select translation units from the given xliff files and write them
 * to the named xliff outfile
 *
 * @param settings the settings object that configures
 * how the tool will operate based on command-line args
 * @returns xliff file with data merged into one
 */
export function xliffSelect(settings: XliffSelectSettings): any {
    if (!settings) return null;

    // Remember which files we have already read, so we don't have
    // to read them again.
    const fileNameCache = new Set<string>();
    const projectName = settings.id;

    const config = new Config({
        xliffVersion: settings.xliffVersion || 1.2,
        xliffStyle: settings.xliffStyle || 'standard'
    });

    const target = createXliff(config);
    (target as any).path = settings.outfile;

    const unitCache: Record<string, TranslationUnit> = {};

    settings.infiles.forEach(function (file) {
        if (fileNameCache.has(file)) return;
        if (fs.existsSync(file)) {
            logger.info('Selecting from ' + file + ' ...');
            const data = fs.readFileSync(file, 'utf-8');
            
            const xliff = createXliff(config);
            xliff.parse(data);
            
            xliff.getTranslationUnits().forEach(function(unit: TranslationUnit) {
                if (projectName) {
                    unit.project = projectName;
                }
                unit.extended = unit.extended || {};
                if (typeof(settings.extendedAttr) === 'object') {
                    Object.assign(unit.extended, settings.extendedAttr);
                }
                unit.extended['original-file'] = file;
                const hash = tuHash(unit);
                unitCache[hash] = unit;
            });
            fileNameCache.add(file);
        } else {
            logger.warn('Could not open input file ' + file);
        }
    });

    let units: TranslationUnit[] = []; // get all the units from the cache
    for (const key in unitCache) {
        units.push(unitCache[key]);
    }

    // now that they are merged, select from them according to
    // the selection criteria

    if (units.length > 0 && settings.criteria) {
        const criteria = parseCriteria(settings.criteria);
        let totalunits = 0;
        let sourcewords = 0;
        let targetwords = 0;
        
        if (criteria.random) {
            // Mix up the units first and then perform the normal criteria below.
            // This works by first assigning a random number to each unit, then
            // sorting by that random number, and finally just dropping that
            // number so that we are left with an array of randomly sorted units
            // where more filter criteria can be applied below.
            const random: RandomUnit[] = units.map(function(unit) {
                return {
                    index: Math.random(),
                    unit: unit
                };
            });
            units = random.sort(function(left, right) {
                return left.index - right.index;
            }).map(function(element) {
                return element.unit;
            });
        }

        units = units.filter(function(unit) {
            if (criteria.maxunits) {
                if (totalunits >= criteria.maxunits) {
                    return false;
                }
                totalunits++;
            }

            if (criteria.maxsource) {
                const count = wordCount(unit.source);
                if (sourcewords + count >= criteria.maxsource) {
                    return false;
                }
                sourcewords += count;
            }

            if (criteria.maxtarget) {
                const count = wordCount(unit.target || '');
                if (targetwords + count >= criteria.maxtarget) {
                    return false;
                }
                targetwords += count;
            }

            if (criteria.category && (!unit.quantity || unit.quantity !== criteria.category)) {
                // units that are part of a plural have a quantity field
                return false;
            }

            if (criteria.index !== undefined && (!unit.ordinal || unit.ordinal !== criteria.index)) {
                // units that are part of an array have an ordinal field
                return false;
            }

            if (criteria.fields) {
                const fieldNames = Object.keys(criteria.fields);
                for (let i = 0; i < fieldNames.length; i++) {
                    const field = fieldNames[i];
                    const re = criteria.fields[fieldNames[i]];
                    re.lastIndex = 0;
                    const fieldValue = unit[field] || '';
                    if (!fieldValue.match(re)) {
                        return false;
                    }
                }
            }

            return true;
        });
    }

    if (units.length > 0) {
        units.forEach(unit => {
            target.addTranslationUnit(unit);
        });
    } else {
        // if no units were selected, then just return the empty target
        logger.warn('No translation units matched the selection criteria.');
    }

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

const knownFields: Record<string, boolean> = {
    project: true,
    context: true,
    sourceLocale: true,
    targetLocale: true,
    key: true,
    pathName: true,
    state: true,
    comment: true,
    dnt: true,
    datatype: true,
    resType: true,
    flavor: true,
    source: true,
    target: true
};

const knownCategoryNames: Record<string, boolean> = {
    zero: true,
    one: true,
    two: true,
    few: true,
    many: true,
    other: true
};

/**
 * Take a command-line criteria string and parse it into an object
 * with criteria in it.
 * @param criteria the criteria string
 * @returns an object with the parsed criteria in the form
 * of properties that map to values to test against
 */
export function parseCriteria(criteria: string): SelectionCriteria {
    if (!criteria) return {};

    const criteriaObj: SelectionCriteria = {};

    const parts = criteria.split(/,/g);
    parts.every(function(part) {
        const lowerPart = part.toLowerCase();

        if (lowerPart.startsWith('maxunits:')) {
            criteriaObj.maxunits = parseInt(part.substring(9));
        } else if (lowerPart.startsWith('maxsource:')) {
            criteriaObj.maxsource = parseInt(part.substring(10));
        } else if (lowerPart.startsWith('maxtarget:')) {
            criteriaObj.maxtarget = parseInt(part.substring(10));
        } else if (lowerPart === 'random') {
            criteriaObj.random = true;
        } else {
            // get the first equals sign only, as there may be equals signs in the regex
            const equals = part.indexOf('=');
            if (equals > 0) {
                let field = part.substring(0, equals);
                const value = part.substring(equals + 1);
                if (!value) {
                    throw new Error('Incorrect syntax for criteria: ' + part);
                }
                const regex = new RegExp(value);
                const dot = field.indexOf('.');
                if (dot > -1) {
                    const subpart = field.substring(dot + 1);
                    field = field.substring(0, dot);
                    const number = parseInt(subpart);
                    if (isNaN(number)) {
                        if (knownCategoryNames[subpart]) {
                            criteriaObj.category = subpart;
                        } else {
                            throw new Error('Unknown category name in criteria: ' + part);
                        }
                    } else {
                        criteriaObj.index = number;
                    }
                }
                if (!knownFields[field]) {
                    throw new Error('Unknown field name in criteria: ' + part);
                }
                if (!criteriaObj.fields) criteriaObj.fields = {};
                criteriaObj.fields[field] = regex;
            } else {
                throw new Error('Incorrect syntax for criteria: ' + part);
            }
        }

        return true;
    });

    return criteriaObj;
}

/**
 * Main XliffSelect class with static methods for compatibility
 */
export class XliffSelect {
    /**
     * Select translation units from xliff files
     * @param settings the selection settings
     * @returns xliff file with selected units
     */
    static select(settings: XliffSelectSettings): any {
        return xliffSelect(settings);
    }

    /**
     * Write the selected xliff file to disk
     * @param xliff the xliff file with selected units
     * @returns true if successful
     */
    static write(xliff: any): boolean {
        return write(xliff);
    }

    /**
     * Parse selection criteria string
     * @param criteria the criteria string
     * @returns parsed criteria object
     */
    static parseCriteria(criteria: string): SelectionCriteria {
        return parseCriteria(criteria);
    }
}

// Default export for compatibility with existing code
export default function(settings: XliffSelectSettings): any {
    return xliffSelect(settings);
} 