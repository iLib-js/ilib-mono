/*
 * ConvertedModulesExample.ts - Example usage of converted XLIFF modules
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

import { xliffSplit, distribute, write as writeSplit } from './XliffSplit';
import { xliffMerge, write as writeMerge } from './XliffMerge';
import { xliffSelect, write as writeSelect, parseCriteria } from './XliffSelect';

/**
 * Example usage of the converted XLIFF modules
 */
export class ConvertedModulesExample {
    
    /**
     * Example of splitting XLIFF files
     */
    static async demonstrateSplit() {
        console.log('=== XLIFF Split Example ===');
        
        const splitSettings = {
            infiles: ['input1.xliff', 'input2.xliff'],
            splittype: 'language', // or 'project'
            xliffVersion: 1.2,
            xliffStyle: 'standard',
            targetDir: './output'
        };

        try {
            // Split the files
            const translationUnits = xliffSplit(splitSettings);
            console.log(`Found ${translationUnits.length} translation units`);

            // Distribute by type
            const distributed = distribute(translationUnits, splitSettings);
            console.log(`Distributed into ${Object.keys(distributed).length} files`);

            // Write to disk
            const success = writeSplit(distributed);
            console.log(`Split operation ${success ? 'successful' : 'failed'}`);
            
        } catch (error) {
            console.error('Split operation failed:', error);
        }
    }

    /**
     * Example of merging XLIFF files
     */
    static async demonstrateMerge() {
        console.log('=== XLIFF Merge Example ===');
        
        const mergeSettings = {
            outfile: 'merged-output.xliff',
            infiles: ['file1.xliff', 'file2.xliff', 'file3.xliff'],
            xliffVersion: 1.2,
            xliffStyle: 'standard'
        };

        try {
            // Merge the files
            const mergedXliff = xliffMerge(mergeSettings);
            console.log('Files merged successfully');

            // Write to disk
            const success = writeMerge(mergedXliff);
            console.log(`Merge operation ${success ? 'successful' : 'failed'}`);
            
        } catch (error) {
            console.error('Merge operation failed:', error);
        }
    }

    /**
     * Example of selecting from XLIFF files
     */
    static async demonstrateSelect() {
        console.log('=== XLIFF Select Example ===');
        
        const selectSettings = {
            criteria: 'random,maxunits:100,project=myproject',
            outfile: 'selected-units.xliff',
            infiles: ['source1.xliff', 'source2.xliff'],
            xliffVersion: 1.2,
            xliffStyle: 'standard',
            id: 'myproject',
            extendedAttr: {
                'custom-field': 'custom-value'
            }
        };

        try {
            // Parse criteria to understand what we're selecting
            const criteria = parseCriteria(selectSettings.criteria);
            console.log('Selection criteria:', criteria);

            // Select units
            const selectedXliff = xliffSelect(selectSettings);
            console.log('Selection completed');

            // Write to disk
            const success = writeSelect(selectedXliff);
            console.log(`Select operation ${success ? 'successful' : 'failed'}`);
            
        } catch (error) {
            console.error('Select operation failed:', error);
        }
    }

    /**
     * Run all examples
     */
    static async runAllExamples() {
        await this.demonstrateSplit();
        console.log();
        
        await this.demonstrateMerge();
        console.log();
        
        await this.demonstrateSelect();
    }
}

/**
 * Advanced usage patterns
 */
export class AdvancedUsageExamples {
    
    /**
     * Custom criteria parsing example
     */
    static demonstrateCriteriaParsing() {
        console.log('=== Criteria Parsing Examples ===');
        
        const examples = [
            'random',
            'maxunits:50',
            'maxsource:1000,maxtarget:800',
            'project=myproject,targetLocale=fr-FR',
            'source=hello.*,state=translated',
            'quantity.one,maxunits:10'
        ];

        examples.forEach(criteriaString => {
            try {
                const parsed = parseCriteria(criteriaString);
                console.log(`"${criteriaString}" =>`, parsed);
            } catch (error) {
                console.error(`Error parsing "${criteriaString}":`, (error as Error).message);
            }
        });
    }

    /**
     * Chained operations example
     */
    static async demonstrateChainedOperations() {
        console.log('=== Chained Operations Example ===');
        
        try {
            // Step 1: Merge multiple files
            const mergeSettings = {
                outfile: 'temp-merged.xliff',
                infiles: ['input1.xliff', 'input2.xliff', 'input3.xliff'],
                xliffVersion: 1.2,
                xliffStyle: 'standard'
            };
            
            const merged = xliffMerge(mergeSettings);
            writeMerge(merged);
            console.log('Step 1: Files merged');

            // Step 2: Select specific units from merged file
            const selectSettings = {
                criteria: 'random,maxunits:50',
                outfile: 'temp-selected.xliff',
                infiles: ['temp-merged.xliff'],
                xliffVersion: 1.2,
                xliffStyle: 'standard'
            };
            
            const selected = xliffSelect(selectSettings);
            writeSelect(selected);
            console.log('Step 2: Units selected');

            // Step 3: Split selected units by language
            const splitSettings = {
                infiles: ['temp-selected.xliff'],
                splittype: 'language',
                xliffVersion: 1.2,
                xliffStyle: 'standard',
                targetDir: './final-output'
            };
            
            const units = xliffSplit(splitSettings);
            const distributed = distribute(units, splitSettings);
            writeSplit(distributed);
            console.log('Step 3: Units split by language');
            
            console.log('Chained operations completed successfully');
            
        } catch (error) {
            console.error('Chained operations failed:', error);
        }
    }
}

export default ConvertedModulesExample; 