/*
 * IFile.ts - Interface for File classes that represent individual source files
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
 * Options for creating a File instance
 */
export interface FileOptions {
    project?: any; // Project interface would be defined separately
    pathName?: string;
    locale?: string;
    type?: any; // FileType interface
    flavor?: string;
}

/**
 * Interface representing a source file that can be processed for localization.
 * File classes are responsible for:
 * - Parsing the file content to extract localizable strings
 * - Creating Resource instances for found strings
 * - Writing out localized versions of the file
 * - Managing the translation set for the file
 */
export interface IFile {
    /** The project this file belongs to */
    readonly project: any; // Project interface would be defined separately
    
    /** Path to the file relative to project root */
    readonly pathName: string;
    
    /** The file type that manages this file */
    readonly type: any; // IFileType interface
    
    /** Locale of this file */
    readonly locale?: string;
    
    /** Flavor/variant of this file */
    readonly flavor?: string;
    
    /** Translation set containing resources found in this file */
    readonly set: any; // TranslationSet interface
    
    /** Index for tracking resource ordering */
    resourceIndex?: number;
    
    /**
     * Parse the given data string looking for localizable strings.
     * Extracted strings are added to the file's translation set.
     * @param data The string content to parse
     */
    parse(data: string): void;
    
    /**
     * Extract all localizable strings from the file.
     * Reads the file from disk and calls parse() on the content.
     */
    extract(): void;
    
    /**
     * Return the translation set containing resources found in this file.
     * @returns The set of resources found in this file
     */
    getTranslationSet(): any; // TranslationSet interface
    
    /**
     * Localize the file by writing out translated versions.
     * @param translations Set of translations to use
     * @param locales Array of target locales
     */
    localize?(translations: any, locales: string[]): void; // TranslationSet interface
    
    /**
     * Write out the file (either original or localized version).
     * @param translations Optional translations to apply
     */
    write?(translations?: any): void; // TranslationSet interface
    
    /**
     * Get the locale of this file.
     * @returns The locale string
     */
    getLocale?(): string;
    
    /**
     * Make a resource key for the given source string.
     * @param source The source string to make a key for
     * @returns A unique key for the string
     */
    makeKey?(source: string): string;
}

/**
 * Extended interface for files that support more complex operations
 */
export interface IExtendedFile extends IFile {
    /**
     * Get excluded keys from schema (for YAML files)
     * @returns Array of keys to exclude from localization
     */
    getExcludedKeysFromSchema?(): string[];
    
    /**
     * Check if a resource is translatable
     * @param resource The resource to check
     * @returns True if the resource should be translated
     */
    isTranslatable?(resource: any): boolean;
    
    /**
     * Get context information for a resource
     * @param resource The resource to get context for
     * @returns Context string or undefined
     */
    getContext?(resource: any): string | undefined;
    
    /**
     * Generate a unique ID for a resource
     * @param source The source string
     * @param key Optional key
     * @param comment Optional comment
     * @returns Unique ID string
     */
    generateId?(source: string, key?: string, comment?: string): string;
}

/**
 * Static methods available on File classes
 */
export interface IFileStatic {
    /**
     * Unescape a string from the source format to in-memory representation.
     * @param str The string to unescape
     * @returns The unescaped string
     */
    unescapeString?(str: string): string;
    
    /**
     * Clean a string for resource matching by normalizing whitespace and escaping.
     * @param str The string to clean
     * @returns The cleaned string
     */
    cleanString?(str: string): string;
    
    /**
     * Escape a string for the target file format.
     * @param str The string to escape
     * @returns The escaped string
     */
    escapeString?(str: string): string;
} 