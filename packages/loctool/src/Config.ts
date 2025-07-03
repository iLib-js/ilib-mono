/*
 * Config.ts - unified configuration class for loctool
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

/**
 * Unified configuration class that combines all command-line options 
 * and project.json settings into a single configuration object.
 * 
 * This eliminates the separation between "options" (from project.json) 
 * and "settings" (from command-line) that existed in the original code.
 */
export class Config {
    // Project identification
    public name?: string;
    public id?: string;
    public projectType: string = "web";
    public schema?: string;
    public noInstance?: boolean;

    // Localization settings
    public sourceLocale: string = "en-US";
    public targetLocale?: string;
    public pseudoLocale?: string | string[] | Record<string, string>;
    public locales: string[] = [];
    public localeMap: Record<string, string> = {};
    public localeInherit: Record<string, string> = {};
    public nopseudo: boolean = true;
    public generatePseudo?: boolean;

    // Directory configuration
    public rootDir: string = ".";
    public targetDir: string = ".";
    public translationsDir?: string | string[];
    public xliffsDir?: string | string[]; // deprecated, but maintained for compatibility
    public xliffsOut?: string;
    public resourceDirs?: Record<string, string | string[]>;

    // File filtering
    public includes: string[] = [];
    public excludes: string[] = [
        "**/node_modules",
        "**/bower_components", 
        "**/jspm_packages",
        "**/.git",
        "**/.svn",
        "package.json",
        "package-lock.json",
        "project.json",
        "log4js.json",
        "yarn.lock",
        ".gitignore",
        ".project",
        ".circleci",
        ".travis.yml",
        ".npm",
        ".next",
        ".eslintcache"
    ];

    // File type and plugin configuration
    public plugins?: string[];
    public fileTypes?: Record<string, boolean>;
    public resourceFileTypes?: Record<string, string>;
    public resourceFileNames?: Record<string, string>;
    
    // XLIFF and output configuration
    public xliffVersion: number = 1.2;
    public xliffStyle: string = "standard";
    public xliffResName?: string;
    public xliffResRoot?: string;
    public allowDups: boolean = true;
    public intermediateFormat: string = "xliff";

    // Operation modes and flags
    public mode?: string;
    public command?: string;
    public help: boolean = false;
    public version: boolean = false;
    public pull: boolean = false;
    public identify: boolean = false;
    public oldHamlLoc: boolean = false;
    public localizeOnly: boolean = false;
    public onlyTranslated: boolean = false;
    public convertPlurals: boolean = false;
    public loadTranslations: boolean = true;

    // Logging and output
    public quiet: boolean = false;
    public silent: boolean = false;

    // Conversion and processing options
    public segmentation: string = "paragraph";

    // Command-specific options
    public splittype?: string;
    public infiles?: string[];
    public outfile?: string;
    public criteria?: string;
    public extendedAttr?: Record<string, string>;

    // Android-specific
    public flavors?: string[];

    constructor(options: Partial<Config> = {}) {
        // Apply all provided options to this instance
        Object.assign(this, options);
        
        // Ensure arrays are properly initialized
        if (!this.locales) this.locales = [];
        if (!this.includes) this.includes = [];
        if (!this.excludes) this.excludes = [];
        if (!this.localeMap) this.localeMap = {};
        if (!this.localeInherit) this.localeInherit = {};
    }

    /**
     * Merge command-line settings with project.json options
     * @param commandLineSettings Settings from command-line parsing
     * @param projectOptions Options from project.json file
     * @returns A new Config instance with merged settings
     */
    static merge(commandLineSettings: Partial<Config> = {}, projectOptions: Partial<Config> = {}): Config {
        // Command-line settings take precedence over project.json options
        const merged = {
            ...projectOptions,
            ...commandLineSettings
        };

        // Special handling for arrays - concatenate instead of overwrite
        if (projectOptions.locales && commandLineSettings.locales) {
            merged.locales = [...new Set([...projectOptions.locales, ...commandLineSettings.locales])];
        }

        if (projectOptions.excludes && commandLineSettings.excludes) {
            merged.excludes = [...new Set([...projectOptions.excludes, ...commandLineSettings.excludes])];
        }

        if (projectOptions.includes && commandLineSettings.includes) {
            merged.includes = [...new Set([...projectOptions.includes, ...commandLineSettings.includes])];
        }

        if (projectOptions.plugins && commandLineSettings.plugins) {
            merged.plugins = [...new Set([...projectOptions.plugins, ...commandLineSettings.plugins])];
        }

        // Special handling for objects - merge instead of overwrite
        if (projectOptions.localeMap && commandLineSettings.localeMap) {
            merged.localeMap = { ...projectOptions.localeMap, ...commandLineSettings.localeMap };
        }

        if (projectOptions.localeInherit && commandLineSettings.localeInherit) {
            merged.localeInherit = { ...projectOptions.localeInherit, ...commandLineSettings.localeInherit };
        }

        if (projectOptions.resourceDirs && commandLineSettings.resourceDirs) {
            merged.resourceDirs = { ...projectOptions.resourceDirs, ...commandLineSettings.resourceDirs };
        }

        if (projectOptions.fileTypes && commandLineSettings.fileTypes) {
            merged.fileTypes = { ...projectOptions.fileTypes, ...commandLineSettings.fileTypes };
        }

        if (projectOptions.resourceFileTypes && commandLineSettings.resourceFileTypes) {
            merged.resourceFileTypes = { ...projectOptions.resourceFileTypes, ...commandLineSettings.resourceFileTypes };
        }

        if (projectOptions.resourceFileNames && commandLineSettings.resourceFileNames) {
            merged.resourceFileNames = { ...projectOptions.resourceFileNames, ...commandLineSettings.resourceFileNames };
        }

        if (projectOptions.extendedAttr && commandLineSettings.extendedAttr) {
            merged.extendedAttr = { ...projectOptions.extendedAttr, ...commandLineSettings.extendedAttr };
        }

        return new Config(merged);
    }



    /**
     * Create a Config from a project.json-style object
     * @param projectJson Parsed project.json content
     * @returns Config instance with project options
     */
    static fromProjectJson(projectJson: any): Config {
        const config = new Config();

        // Map project.json properties to Config properties
        if (projectJson.name) config.name = projectJson.name;
        if (projectJson.id) config.id = projectJson.id;
        if (projectJson.projectType) config.projectType = projectJson.projectType;
        if (projectJson.sourceLocale) config.sourceLocale = projectJson.sourceLocale;
        if (projectJson.targetLocale) config.targetLocale = projectJson.targetLocale;
        if (projectJson.pseudoLocale) config.pseudoLocale = projectJson.pseudoLocale;
        if (projectJson.schema) config.schema = projectJson.schema;
        if (projectJson.resourceDirs) config.resourceDirs = projectJson.resourceDirs;
        if (projectJson.translationsDir) config.translationsDir = projectJson.translationsDir;
        if (projectJson.xliffsDir) config.xliffsDir = projectJson.xliffsDir;
        if (projectJson.includes) config.includes = projectJson.includes;
        if (projectJson.excludes) config.excludes = projectJson.excludes;
        if (projectJson.plugins) config.plugins = projectJson.plugins;
        if (projectJson.generatePseudo !== undefined) config.generatePseudo = projectJson.generatePseudo;

        // Handle nested settings object
        if (projectJson.settings) {
            const settings = projectJson.settings;
            if (settings.locales) config.locales = settings.locales;
            if (settings.targetDir) config.targetDir = settings.targetDir;
            if (settings.translationsDir) config.translationsDir = settings.translationsDir;
            if (settings.xliffsDir) config.xliffsDir = settings.xliffsDir;
            if (settings.xliffsOut) config.xliffsOut = settings.xliffsOut;
            if (settings.localizeOnly !== undefined) config.localizeOnly = settings.localizeOnly;
            if (settings.nopseudo !== undefined) config.nopseudo = settings.nopseudo;
            if (settings.xliffVersion) config.xliffVersion = settings.xliffVersion;
            if (settings.xliffStyle) config.xliffStyle = settings.xliffStyle;
            if (settings.allowDups !== undefined) config.allowDups = settings.allowDups;
            if (settings.intermediateFormat) config.intermediateFormat = settings.intermediateFormat;
            if (settings.loadTranslations !== undefined) config.loadTranslations = settings.loadTranslations;
            if (settings.exclude) config.excludes = [...config.excludes, ...settings.exclude];
            if (settings.localeMap) config.localeMap = settings.localeMap;
            if (settings.localeInherit) config.localeInherit = settings.localeInherit;
            if (settings.convertPlurals !== undefined) config.convertPlurals = settings.convertPlurals;
            if (settings.fileTypes) config.fileTypes = settings.fileTypes;
            if (settings.resourceFileTypes) config.resourceFileTypes = settings.resourceFileTypes;
            if (settings.resourceFileNames) config.resourceFileNames = settings.resourceFileNames;
            if (settings.resourceDirs) config.resourceDirs = { ...config.resourceDirs, ...settings.resourceDirs };
            if (settings.flavors) config.flavors = settings.flavors;
        }

        return config;
    }

    /**
     * Convert this Config back to a project.json-style object
     * @returns Object suitable for writing to project.json
     */
    toProjectJson(): any {
        return {
            name: this.name,
            id: this.id,
            projectType: this.projectType,
            sourceLocale: this.sourceLocale,
            pseudoLocale: this.pseudoLocale,
            schema: this.schema,
            resourceDirs: this.resourceDirs,
            translationsDir: this.translationsDir,
            includes: this.includes,
            excludes: this.excludes,
            plugins: this.plugins,
            generatePseudo: this.generatePseudo,
            settings: {
                locales: this.locales,
                targetDir: this.targetDir,
                xliffsOut: this.xliffsOut,
                localizeOnly: this.localizeOnly,
                nopseudo: this.nopseudo,
                xliffVersion: this.xliffVersion,
                xliffStyle: this.xliffStyle,
                allowDups: this.allowDups,
                intermediateFormat: this.intermediateFormat,
                localeMap: this.localeMap,
                localeInherit: this.localeInherit,
                convertPlurals: this.convertPlurals,
                fileTypes: this.fileTypes,
                resourceFileTypes: this.resourceFileTypes,
                resourceFileNames: this.resourceFileNames,
                flavors: this.flavors
            }
        };
    }

    /**
     * Validate the configuration and throw errors for invalid settings
     */
    validate(): void {
        if (!this.sourceLocale) {
            throw new Error("sourceLocale is required");
        }

        if (this.xliffVersion && ![1.2, 2, 2.0].includes(this.xliffVersion)) {
            throw new Error("xliffVersion must be 1.2 or 2");
        }

        if (this.xliffStyle && !["standard", "custom"].includes(this.xliffStyle)) {
            throw new Error("xliffStyle must be 'standard' or 'custom'");
        }

        if (this.intermediateFormat && !["xliff", "po"].includes(this.intermediateFormat)) {
            throw new Error("intermediateFormat must be 'xliff' or 'po'");
        }

        if (this.segmentation && !["paragraph", "sentence"].includes(this.segmentation)) {
            throw new Error("segmentation must be 'paragraph' or 'sentence'");
        }

        const validProjectTypes = ["android", "iosobjc", "iosswift", "swift", "web", "custom"];
        if (this.projectType && !validProjectTypes.includes(this.projectType)) {
            throw new Error(`projectType must be one of: ${validProjectTypes.join(", ")}`);
        }
    }

    /**
     * Get a deep copy of this configuration
     */
    clone(): Config {
        return new Config(JSON.parse(JSON.stringify(this)));
    }
}