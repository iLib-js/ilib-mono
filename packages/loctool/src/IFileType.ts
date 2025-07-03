/*
 * IFileType.ts - Interface for FileType classes that manage collections of source files
 *
 * Copyright © 2025 JEDLSoft
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

/**
 * Callback function for asynchronous operations
 */
export type CallbackFunction = (error?: Error) => void;

/**
 * Translation status information for files
 */
export interface FileTranslationStatus {
    path: string;
    fullyTranslated: boolean;
}

/**
 * File information aggregated by FileType
 */
export interface FileInfo {
    translated: string[];
    untranslated: string[];
}

/**
 * Interface representing a FileType that manages a collection of source files of a particular type.
 * FileType classes are responsible for:
 * - Determining which files they can handle
 * - Creating appropriate File instances for processing
 * - Managing extracted resources and translation sets
 * - Writing out aggregated resources
 * - Handling pseudo-localization
 */
export interface IFileType {
    /** The project this file type belongs to */
    readonly project: any; // Project interface would be defined separately
    
    /** The type identifier for this file type (e.g., "javascript", "markdown") */
    readonly type: string;
    
    /** The datatype identifier for resources (e.g., "javascript", "markdown") */
    readonly datatype: string;
    
    /** Set of all extracted resources */
    readonly extracted: any; // TranslationSet interface would be defined separately
    
    /** Set of new resources not yet in the database */
    readonly newres: any; // TranslationSet interface
    
    /** Set of pseudo-localized resources */
    readonly pseudo: any; // TranslationSet interface
    
    /** Source locale for this file type */
    readonly sourceLocale: string;
    
    /** Pseudo locale for missing string handling */
    readonly pseudoLocale: string;
    
    /** Map of pseudo localizers by locale */
    readonly pseudos: { [locale: string]: any }; // Pseudo interface would be defined separately
    
    /** Pseudo localizer for missing strings */
    readonly missingPseudo?: any; // Pseudo interface
    
    /** File extensions this type can handle */
    readonly extensions: string[];
    
    /** Resource files managed by this type */
    readonly resourceFiles: { [key: string]: any }; // ResourceFile interface would be defined separately
    
    /** Optional file information for tracking translation status */
    readonly fileInfo?: FileInfo;
    
    /**
     * Initialize the file type. Opportunity for loading files or other async setup.
     * @param cb Callback function to call when initialization is complete
     */
    init(cb: CallbackFunction): void;
    
    /**
     * Return the name of this file type for display purposes.
     * @returns The human-readable name of this file type
     */
    name(): string;
    
    /**
     * Return true if the given path is handled by this file type.
     * @param pathName Path to the file being questioned
     * @returns True if this file type handles the given path
     */
    handles(pathName: string): boolean;
    
    /**
     * Create a new file instance for the given path.
     * @param path Path to the file
     * @returns New file instance appropriate for this file type
     */
    newFile(path: string): any; // IFile interface would be defined separately
    
    /**
     * Get all resources extracted so far.
     * @returns Array of resources extracted so far
     */
    getResources(): any[]; // Resource interface would be defined separately
    
    /**
     * Return the set of strings extracted from all instances of this type.
     * @returns The set of extracted strings
     */
    getExtracted(): any; // TranslationSet interface
    
    /**
     * Return the set of pseudo-localized strings.
     * @returns The set of pseudo-localized strings
     */
    getPseudo(): any; // TranslationSet interface
    
    /**
     * Return the set of new strings not in the database.
     * @returns The set of new strings
     */
    getNew(): any; // TranslationSet interface
    
    /**
     * Add the contents of the given translation set to extracted resources.
     * @param set Set of resources to add
     */
    addSet(set: any): void; // TranslationSet interface
    
    /**
     * Return file extensions that this file type can handle.
     * @returns Array of file extensions
     */
    getExtensions(): string[];
    
    /**
     * Generate pseudo-localized resources for the given locale.
     * @param locale Target locale for generated resources
     * @param pb Pseudo translation bundle for derivation
     * @param set Optional set to use instead of default extracted set
     * @returns Set of generated pseudo resources
     */
    generatePseudo(locale: string, pb: any, set?: any): any; // TranslationSet interface
    
    /**
     * Write out aggregated resources for this file type.
     * @param translations Set of translations from repository
     * @param locales List of locales to localize to
     */
    write(translations: any, locales: string[]): void; // TranslationSet interface
    
    /**
     * Register data types with the resource factory.
     * Called to set up which resource classes to use for deserialization.
     */
    registerDataTypes(): void;
    
    /**
     * Add translation status information for a file.
     * @param fileInfo Information about file translation status
     */
    addTranslationStatus?(fileInfo: FileTranslationStatus): void;
    
    /**
     * Called when the project is closing. Opportunity for cleanup.
     */
    projectClose?(): void;
    
    /**
     * Clean up resources when the file type is no longer needed.
     */
    close(): void;
} 