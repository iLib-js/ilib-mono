/*
 * IntermediateFileFactory.ts - factory for creating intermediate files
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
import { XliffIntermediateFile } from './XliffIntermediateFile';
import { POIntermediateFile } from './POIntermediateFile';
import { PropertiesIntermediateFile } from './PropertiesIntermediateFile';

// Declare require for Node.js modules
declare const require: any;
const path = require('path');

/**
 * Factory function to create an intermediate file of the requested type from the given path.
 * @param options options for the intermediate file
 * @returns the intermediate file
 * @throws {Error} if the type is not recognized
 */
export function getIntermediateFile(options: IntermediateFileOptions): IIntermediateFile {
    if (!options) {
        throw new Error('Options are required to create an intermediate file');
    }

    let type = options.type;
    
    // Determine type from file extension if not provided
    if (!type && options.path) {
        const ext = path.extname(options.path).toLowerCase();
        if (ext === '.xlf' || ext === '.xliff') {
            type = 'xliff';
        } else if (ext === '.po' || ext === '.pot') {
            type = 'po';
        } else if (ext === '.properties') {
            type = 'properties';
        }
    }

    switch (type) {
        case 'xliff':
            return new XliffIntermediateFile(options);
        case 'po':
            return new POIntermediateFile(options);
        case 'properties':
            return new PropertiesIntermediateFile(options);
        default:
            throw new Error(`Unknown intermediate file type: ${type}`);
    }
}

/**
 * Map of intermediate format types to their default file extensions
 */
const intFormatToFileExtensionMap: Record<string, string> = {
    'xliff': 'xliff',
    'po': 'pot',
    'properties': 'properties'
};

/**
 * Get the default file extension for a given intermediate file type
 * @param type the intermediate file type
 * @returns the file extension
 */
export function getIntermediateFileExtension(type: string): string {
    return intFormatToFileExtensionMap[type] || type;
}

/**
 * Return an array of all known file name extensions for intermediate files.
 * @returns array of extensions
 */
export function getIntermediateFileExtensions(): string[] {
    return ['xlf', 'xliff', 'po', 'pot', 'properties'];
}

/**
 * Determine the intermediate file type from a file path
 * @param filePath the path to the file
 * @returns the determined type or undefined if not recognized
 */
export function getIntermediateFileType(filePath: string): string | undefined {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.xlf' || ext === '.xliff') {
        return 'xliff';
    } else if (ext === '.po' || ext === '.pot') {
        return 'po';
    } else if (ext === '.properties') {
        return 'properties';
    }
    
    return undefined;
}

/**
 * Check if a file path represents a known intermediate file type
 * @param filePath the path to check
 * @returns true if the file is a known intermediate file type
 */
export function isIntermediateFile(filePath: string): boolean {
    return getIntermediateFileType(filePath) !== undefined;
} 