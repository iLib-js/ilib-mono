/*
 * Project.ts - represents a project
 *
 * Copyright © 2016-2017, 2019-2025 HealthTap, Inc.
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

// Node.js built-in modules
import * as fs from 'fs';
import * as path from 'path';
import * as log4js from 'log4js';

// External libraries
import { Queue } from 'js-stl';
import * as ilib from 'ilib';
import * as JSUtils from 'ilib/lib/JSUtils.js';
import { Locale } from 'ilib/lib/Locale.js';

// Internal modules
import * as LocalRepository from '../lib/LocalRepository.js';
import * as TranslationSet from '../lib/TranslationSet.js';
import * as ResourceFactory from '../lib/ResourceFactory.js';
import * as PseudoFactory from '../lib/PseudoFactory.js';
import * as GenerateMode from '../lib/GenerateMode.js';
import * as Xliff from '../lib/Xliff.js';
import * as utils from '../lib/utils.js';
import * as conversions from '../lib/ResourceConvert.js';
import * as pluralCategories from '../db/pluralCategories.json';
import * as iff from '../lib/IntermediateFileFactory.js';
import { Config } from './Config';

const getIntermediateFile = iff.getIntermediateFile;
const getIntermediateFileExtension = iff.getIntermediateFileExtension;
const logger = log4js.getLogger("loctool.lib.Project");

// Interfaces and types

interface FileType {
    name(): string;
    type: string;
    init?(callback: () => void): void;
    registerDataTypes?(): void;
    getResourceTypes(): Record<string, string>;
    getDataType(): string;
    getExtensions(): string[];
    handles(pathName: string): boolean;
    newFile(pathName: string, options: any): any;
    addSet(set: any): void;
    getNew(translations: any): any;
    generatePseudo?(locale: string, pseudoType?: string): void;
    getPseudo(): any;
    getExtracted(): any;
    write(superset: any, locales: string[]): void;
    projectClose?(): void;
    pseudos?: Record<string, string>;
    modern?: any;
}

interface Resource {
    source?: string;
    sourceArray?: string[];
    sourceStrings?: Record<string, string>;
    getTargetLocale(): string;
    dnt?: boolean;
    getType(): string;
    getSourcePlurals(): Record<string, string>;
    setTargetPlurals(plurals: Record<string, string>): void;
}

type Callback = () => void;

function smartJoin(parent?: string, child?: string): string {
    if (!parent) return child || '';
    if (!child || path.isAbsolute(child)) {
        return child || '';
    }
    return path.join(parent, child);
}

function validateMap(map?: Record<string, any>): Record<string, string> {
    const valid: Record<string, string> = {};
    if (map) {
        for (const prop in map) {
            if (prop && typeof(map[prop]) === "string") {
               valid[prop] = map[prop];
            }
        }
    }
    return valid;
}

const genericResTypes: Record<string, string> = {
    "string": "ResourceString",
    "array": "ResourceArray",
    "plural": "ResourcePlural"
};

/**
 * @class Represent a loctool project.
 *
 * The options may contain any of the following properties:
 *
 * <ul>
 * <li>sourceLocale {String} - the source locale of this project (defaults to en-US)
 * <li>pseudoLocale {String} - the locale to use as the pseudo locale
 * <li>name {String} - human readable name of this project
 * <li>id {String} - unique id of this project (usually the git repo name)
 * <li>projectType {String} - The type of this project. This may be any one of "android", "iosobjc", "iosswift", or "web"
 * <li>resourceDirs {Array.<String>} - an array of directories containing resource files in this project
 * <li>excludes {Array.<String>} - an array of paths to exclude from scanning for strings
 * </ul>
 *
 * @param {Object} options settings for the current project
 * @param {String} root
 * @param {Object} settings from the command-line
 */
export class Project {
    public config: Config;
    public sourceLocale: string = "en-US";
    public targetLocale?: string;
    public pseudoLocales: Record<string, string> = {};
    public pseudoLocale: string = "zxx-XX";
    public localeMap: Record<string, string>;
    public localeInherit: Record<string, string>;
    public root: string;
    public target: string;
    public schema?: any;
    public translationsDir: string[];
    public xliffsOut: string;
    public localizeOnly: boolean;
    public translations: any;
    public newres: any;
    public pseudo: any;
    public extracted: any;
    public paths: any;
    public files: any;
    public db?: any;
    public fileTypes: FileType[] = [];
    public extensionMap: Record<string, FileType[]> = {};
    public locales: string[] = [];
    public defaultLocales?: string[];

    constructor(config: Config, root: string) {
        this.config = config;
        
        if (config.noInstance) {
            // used for inheritance not for localization...
            return;
        }

        this.sourceLocale = config.sourceLocale || "en-US";
        this.targetLocale = config.targetLocale;
        
        // Initialize pseudoLocales
        let localesToAdd: string[];
        
        if (!config.pseudoLocale) {
            this.pseudoLocale = "zxx-XX";
            localesToAdd = [this.pseudoLocale];
            this.pseudoLocales = (PseudoFactory as any).defaultPseudoLocales;
        } else if (typeof(config.pseudoLocale) === "string") {
            this.pseudoLocale = config.pseudoLocale;
            this.pseudoLocales = {};
            this.pseudoLocales[this.pseudoLocale] = "debug";
            localesToAdd = [this.pseudoLocale];
        } else if (Array.isArray(config.pseudoLocale)) {
            // transform to a mapping object
            const pseudos: Record<string, string> = {};
            localesToAdd = [];
            config.pseudoLocale.forEach((locale: string) => {
                pseudos[locale] = (PseudoFactory as any).defaultPseudoLocales[locale] || "debug";
                localesToAdd.push(locale);
            });
            this.pseudoLocale = "zxx-XX";
            this.pseudoLocales = pseudos;
        } else if (typeof(config.pseudoLocale) !== "object") {
            this.pseudoLocale = "zxx-XX";
            this.pseudoLocales = (PseudoFactory as any).defaultPseudoLocales;
            localesToAdd = [this.pseudoLocale];
        } else {
            // already a mapping object, so find the first debug locale
            this.pseudoLocales = config.pseudoLocale as Record<string, string>;
            for (const locale in this.pseudoLocales) {
                if (this.pseudoLocales[locale] === "debug") {
                    this.pseudoLocale = locale;
                    break;
                }
            }
            localesToAdd = Object.keys(this.pseudoLocales);
            this.pseudoLocale = this.pseudoLocale || "zxx-XX";
        }

        if (config.excludes && Array.isArray(config.excludes)) {
            logger.trace("normalizing excludes");
            // make sure the paths are matchable
            this.config.excludes = config.excludes.map((pathName: string) => 
                path.normalize(pathName)
            );
        }

        if (config.locales && localesToAdd && !config.nopseudo) {
            config.locales = config.locales.concat(localesToAdd);
        }

        // Remove duplicated locale
        if (config.locales) {
            config.locales = config.locales.filter((val, index, arr) => 
                arr.indexOf(val) === index
            );
        }

        this.localeMap = validateMap(config.localeMap);
        this.localeInherit = validateMap(config.localeInherit);

        this.root = root;  // where localizable files live
        this.target = smartJoin(this.root, config.targetDir || '.'); // where localized stuff is written

        if (typeof config.schema !== "undefined") {
            this.schema = config.schema;
        }

        // where the translation xliff files are read from
        const translationsDir = 
            config.translationsDir ||
            config.xliffsDir ||
            '.';
        
        this.translationsDir = Array.isArray(translationsDir) 
            ? translationsDir.map((dir: string) => smartJoin(this.root, dir))
            : [smartJoin(this.root, translationsDir)];

        // where the xliff files are written to
        this.xliffsOut = smartJoin(this.root, config.xliffsOut || '.');

        // generate a localization resource only. not create any other files after running loctool
        this.localizeOnly = config.localizeOnly || false;

        // all translations in the db
        this.translations = new (TranslationSet as any)(this.sourceLocale);

        // new translations that are not in the db
        this.newres = new (TranslationSet as any)(this.sourceLocale);

        // the pseudo-localized translations
        this.pseudo = new (TranslationSet as any)(this.sourceLocale);

        // all extracted translations
        this.extracted = new (TranslationSet as any)(this.sourceLocale);

        this.paths = new Queue();
        this.files = new Queue();

        if (typeof(config.loadTranslations) !== 'boolean' || config.loadTranslations) {
            this.db = new (LocalRepository as any)({
                sourceLocale: this.sourceLocale,
                pseudoLocale: this.pseudoLocale,
                pathName: ((config.xliffVersion !== 2) ? (path.join(this.translationsDir[0], config.id + ".xliff")) : undefined),
                project: this,
                translationsDir: this.translationsDir,
                intermediateFormat: config.intermediateFormat
            });
        }

        logger.debug("New Project: " + this.root + " source: " + this.sourceLocale + ", pseudo: " + this.pseudoLocale);
    }

    /**
     * @private
     */
    private initFileTypes(array: FileType[], cb: Callback): void {
        if (array && array.length) {
            if (typeof(array[0].init) === 'function') {
                array[0].init(() => {
                    this.initFileTypes(array.slice(1), cb);
                });
            } else {
                this.initFileTypes(array.slice(1), cb);
            }
        } else {
            cb();
        }
    }

    /**
     * Initialize the project. This will open any database connections
     * and load files and any other things that are necessary to begin
     * processing the files in this project.
     *
     * @params {Function} cb a callback function to call when the
     * project initialization is done
     */
    public init(cb: Callback): void {
        this.defineFileTypes(); // abstract method implemented in the subclasses
        logger.trace("this.fileTypes.length is " + this.fileTypes.length);

        this.initFileTypes(this.fileTypes, () => {
            // Make sure they register their data types so their resources can be instantiated again later.
            // Also keep track of which file types handle which file name extensions.
            const extensionMap: Record<string, FileType[]> = {};
            
            this.fileTypes.forEach((type: FileType) => {
                if (typeof(type.registerDataTypes) === "function") {
                    type.registerDataTypes();
                } else {
                    const resTypes = JSUtils.merge(genericResTypes, type.getResourceTypes());
                    const datatype = type.getDataType();

                    Object.keys(resTypes).forEach((resType: string) => {
                        (ResourceFactory as any).assignResourceClass(datatype, resType, resTypes[resType]);
                    });
                }
                
                type.getExtensions().forEach((extension: string) => {
                    if (!extensionMap[extension]) {
                        extensionMap[extension] = [];
                    }
                    extensionMap[extension].push(type);
                });
            });
            
            this.extensionMap = extensionMap;

            if (this.db) {
                this.db.init(() => {
                    // use the specified locales if they exist, or else use whatever locales
                    // already exist in the translations. Make sure to also add in the
                    // pseudo-locale.
                    this.db!.getLocales(this.config.id, undefined, (dbLocales: string[]) => {
                        let locales = this.defaultLocales || dbLocales || [];
                        if (!this.defaultLocales && !this.config.nopseudo) {
                            locales = locales.concat(Object.keys(this.pseudoLocales));
                        }

                        // weed out the source locales -> don't have to translate to those!
                        locales = locales.filter((locale: string) => {
                            return locale !== "en" && locale !== this.sourceLocale;
                        });

                        this.locales = locales;
                        cb();
                    });
                });
            } else {
                cb();
            }
        });
    }

    /**
     * Abstract method to be implemented by subclasses
     */
    protected defineFileTypes(): void {
        // This should be implemented by subclasses
        throw new Error("defineFileTypes must be implemented by subclasses");
    }

    /**
     * Return the file type with the given name or undefined
     * if none is found.
     * @param {string} name the name of the file type
     * @returns {FileType} the file type corresponding to the
     * given name
     */
    public getFileType(name: string): FileType | undefined {
        if (!this.fileTypes) return undefined;
        return this.fileTypes.find((filetype: FileType) => filetype.type === name);
    }

    /**
     * Return the translation set for this project.
     *
     * @returns {TranslationSet} the translation set
     */
    public getTranslationSet(): any {
        return this.translations;
    }

    /**
     * Return the LocalRepository for this project.
     *
     * @returns {LocalRepository} the localrepository of this project
     */
    public getRepository(): any {
        return this.db;
    }

    /**
     * Extract all translations according to a given locale list
     *
     * @returns {Array.<Resource>} resources an array of resources
     */
    public getTranslations(locales?: string | string[]): Resource[] {
        if (!locales || !this.db) return [];
        
        let resAll: Resource[] = [];
        const localeArray = Array.isArray(locales) ? locales : [locales];
        
        localeArray.forEach((locale: string) => {
            this.db!.getBy({
                targetLocale: locale
            }, (err: any, res: Resource[]) => {
                resAll = resAll.concat(res);
            });
        });

        return resAll;
    }

    /**
     * Return the unique id of this project. Often this is the
     * name of the repository in source control.
     *
     * @returns {String} the unique id of this project
     */
    public getProjectId(): string | undefined {
        return this.config.id;
    }

    /**
     * Return the project type of this project.
     *
     * @returns {String} the projecttype of this project
     */
    public getProjectType(): string | undefined {
        return this.config.projectType;
    }

    /**
     * Return the root directory of this project.
     *
     * @returns {String} the path to the root dir of this project
     */
    public getRoot(): string {
        return this.root;
    }

    /**
     * Add the given path name the list of files in this project.
     *
     * @returns {String} pathName the path to add to the project
     */
    public addPath(pathName: string): void {
        this.paths.enqueue(pathName);
    }

    /**
     * Return an array of resource directories for the file type.
     * If there are no resource directories for the file type,
     * then this returns an empty array. These resource dirs are
     * relative to the target directory of the project.
     *
     * @returns {Array.<String>} an array of resource directories
     * for the file type.
     */
    public getResourceDirs(type: string): string[] {
        if (this.config.resourceDirs?.[type]) {
            const dirs = this.config.resourceDirs[type];
            return typeof(dirs) === "string" ? [dirs] : dirs;
        }
        return [];
    }

    /**
     * Return true if the given path is included in the list of
     * resource directories for the given type. This method returns
     * true for any path to a directory or file within any resource
     * directory or any of its subdirectories.
     *
     * @param {String} type the type of resources being tested
     * @param {String} pathName the directory name to test
     * @returns {Boolean} true if the path is within one of
     * the resource directories, and false otherwise
     */
    public isResourcePath(type: string, pathName: string): boolean {
        const target = this.target;
        return this.getResourceDirs(type).some((dir: string) => {
            const fullDir = path.join(target, dir);
            return (pathName.substring(0, fullDir.length) === fullDir);
        });
    }

    /**
     * Return true if the given locale is the source locale of this
     * project, or any of the flavors thereof.
     * @param {String} locale the locale spec to test
     * @returns {boolean} true if the given locale is the source
     * locale of this project or any of its flavors, and false
     * otherwise.
     */
    public isSourceLocale(locale: string): boolean {
        const l = new Locale(locale);
        const s = new Locale(this.sourceLocale);
        return (l.getLanguage() === s.getLanguage() && l.getRegion() === s.getRegion() && l.getScript() === s.getScript());
    }

    /**
     * Get the source locale for this project.
     *
     * @returns {string} the locale spec for the source locale of
     * this project
     */
    public getSourceLocale(): string {
        return this.sourceLocale;
    }

    /**
     * Get the debug pseudo-localization locale for this project.
     *
     * @returns {string} the locale spec for the pseudo locale of
     * this project
     */
    public getPseudoLocale(): string {
        return this.pseudoLocale;
    }

    /**
     * Return a list of file types that can handle a file
     * with the given path. Sometimes there is more than
     * one file type that can handle a path. For example,
     * HTML file contain both Javascript and HTML strings
     * in them, so files with a ".html" extension can be
     * handled by both the javascript file type and the
     * HTML file type. Sometimes there are none and the
     * loctool with the current configuration does not
     * know how to handle that type of file.
     *
     * @param {String} pathName path to the file to handle
     * @returns {Array.<FileType>} an array of file type
     * instances that can handle the given path
     */
    public getFileTypes(pathName: string): FileType[] | undefined {
        return this.extensionMap[path.extname(pathName)];
    }

    /**
     * Read all the files and extract all strings. All files in
     * the queue are read in, including translated resource files.
     * This method is not used during localization. If the
     * caller only needs source files to be read in or wants to
     * perform localization, the caller should use the
     * extract() method instead.
     */
    public read(): void {
        let pathName: string;

        while (!this.paths.isEmpty()) {
            pathName = this.paths.dequeue();

            try {
                const types = this.extensionMap[path.extname(pathName)];

                if (types) {
                    types.forEach((type: FileType) => {
                        // If the path name is explicitly given in the includes list, then we handle it regardless of whether
                        // or not the type thinks it should be handled.
                        logger.debug("    " + pathName);
                        const file = type.newFile(pathName, {
                            sourceLocale: this.sourceLocale,
                            targetLocale: this.targetLocale
                        });
                        file.extract();
                        type.addSet(file.getTranslationSet());
                    });
                }
            } catch (e) {
                logger.error("Error while extracting from file " + pathName + ". Skipping...");
                logger.error(e);
            }
        }

        this.paths = undefined as any; // signal to the GC that we are done with this
    }

    /**
     * Extract all strings from source files for all file types and when that is
     * done, call the callback function. Files which are already-translated
     * resource files are skipped.
     *
     * @param {Function} cb callback function to call when the
     * extraction is done
     */
    public extract(cb: Callback): void {
        logger.trace("Extracting strings from project " + this.options.id);

        this.db!.getBy({
            project: this.options.id
        }, (err: any, resources: Resource[]) => {
            logger.trace("Getting all resources. Length: " + resources.length);
            logger.trace("Getting all resources. tu length: " + this.db!.ts.resources.length);
            this.translations.addAll(resources);
            
            let pathName: string;

            while (!this.paths.isEmpty()) {
                pathName = this.paths.dequeue();

                try {
                    const types = this.extensionMap[path.extname(pathName)];

                    if (types) {
                        for (let i = 0; i < types.length; i++) {
                            // If the path name is explicitly given in the includes list, then we handle it regardless of whether
                            // or not the type thinks it should be handled.
                            logger.trace("Checking if " + types[i].name() + " handles " + pathName);
                            if (types[i].handles(pathName)) {
                                logger.debug("    " + pathName);
                                const file = types[i].newFile(pathName, {
                                    sourceLocale: this.sourceLocale,
                                    targetLocale: this.targetLocale
                                });
                                this.files.enqueue(file);
                                file.extract();

                                types[i].addSet(file.getTranslationSet());
                            }
                        }
                    }
                } catch (e) {
                    logger.error("Error while extracting from file " + pathName + ". Skipping...");
                    logger.error(e);
                }
            }

            this.paths = undefined as any; // signal to the GC that we are done with this
            cb();
        });
    }

    /**
     * Load all existing strings from the database, and compare with the
     * newly extracted ones to find which ones to save to the database as
     * new strings. When that is done, call the callback function.
     *
     * @param {Function} cb callback function to call when the
     * save is done
     */
    public save(cb: Callback): void {
        logger.trace("Project save called to save new resources to the DB");

        for (let i = 0; i < this.fileTypes.length; i++) {
            const set = this.fileTypes[i].getNew(this.translations);
            if (set && set.size()) {
                this.newres.addSet(set);
            }
        }

        // this.db.addAll(this.newres, cb);
        cb();
    }

    /**
     * Generate pseudo localized resources based on the English.
     */
    public generatePseudo(): void {
        logger.trace("Project generate pseudo");

        for (let i = 0; i < this.fileTypes.length; i++) {
            const pseudos = this.fileTypes[i].pseudos;
            if (pseudos) {
                for (const locale in pseudos) {
                    if (typeof(this.fileTypes[i].generatePseudo) === 'function') {
                        this.fileTypes[i].generatePseudo!(locale, pseudos[locale]);
                    }
                }
            }
        }

        for (let i = 0; i < this.fileTypes.length; i++) {
            this.pseudo.addSet(this.fileTypes[i].getPseudo());
        }
    }

    /**
     * Extract all strings for all file types and when that is
     * done, call the callback function.
     *
     * @param {Function} cb callback function to call when the
     * extraction is done
     */
    public write(cb: Callback): void {
        logger.trace("Project write");

        let file: any;

        logger.info("Write project " + this.options.id + " to locales " + JSON.stringify(this.locales));

        const superset = new TranslationSet(this.sourceLocale);

        this.db!.getBy({
            targetLocale: this.locales
        }, (err: any, resources: Resource[]) => {
            superset.addAll(resources);

            file = !this.files.isEmpty() && this.files.dequeue();
            while (file) {
                // this generates localized versions of each source file instead of writing
                // an aggregated resource file later. Only some file types implement this.
                file.localize(superset, this.locales);
                file = !this.files.isEmpty() && this.files.dequeue();
            }

            // now write out the aggregate resource files
            for (let i = 0; i < this.fileTypes.length; i++) {
                this.fileTypes[i].write(superset, this.locales);
            }

            logger.trace("Finished writing out the aggregated resource files.");
            cb();
        });
    }

    /**
     * Extract all resource for all xliff files and when that is
     * done, call the callback function.
     *
     * @param {Function} cb callback function to call when the
     * generation is done
     */
    public generateMode(cb: Callback): void {
        logger.trace("Project GenerateMode");

        const genMode = new GenerateMode({
            targetDir: this.settings.targetDir,
            translationsDir: this.translationsDir,
            settings: this.settings
        });

        if (genMode) {
            genMode.init();
        }
        cb();
    }

    /**
     * Return a translation set with all of the strings that have
     * been extracted so far.
     * @returns {TranslationSet} a set of all strings extracted so far
     */
    public getExtracted(): any {
        const extracted = new TranslationSet();
        this.fileTypes.forEach((type: FileType) => {
            extracted.addSet(type.getExtracted());
        });
        return extracted;
    }

    /**
     * If this project specifies a locale mapping either from the project.json
     * file or on the command-line, then the locale will be mapped. If the
     * given locale does not exist in the mapping, it will be returned unchanged.
     *
     * @param {String} locale the locale to map
     * @returns {String} the mapped locale
     */
    public getOutputLocale(locale: string): string {
        return (this.localeMap && this.localeMap[locale]) || locale;
    }

    /**
     * If this project specifies a locale inheritance information either from the project.json
     * file or on the command-line, then the locale will be mapped. If the
     * given locale does not exist in the mapping, it will be returned undefined.
     *
     * @param {String} locale the locale to check
     * @returns {String|undefined} inheritance locale. it returns undefined if it follows current default.
     */
    public getLocaleInherit(locale: string): string | undefined {
        if (typeof (locale) !== "string") return undefined;
        return (this.localeInherit && this.localeInherit[locale]) ? this.localeInherit[locale] : undefined;
    }

    /**
     * Extract all strings for all file types and when that is
     * done, call the callback function.
     *
     * @param {Function} cb callback function to call when the
     * extraction is done
     */
    public close(cb: Callback): void {
        logger.trace("Project close");

        // signal to the GC that we don't need these any more
        // before we recurse and allocate a lot more memory.
        this.files = undefined as any;

        if (!this.localizeOnly) {
            const dir = this.xliffsOut;
            const base = this.options.id!;
            const fileFormat = this.settings.intermediateFormat || "xliff";
            const extractedPath = path.join(dir, base + "-extracted." + getIntermediateFileExtension(fileFormat));
            const extracted = new TranslationSet(this.sourceLocale);

            // make sure the output dir exists before we attempt to write anything there!
            utils.makeDirs(dir);

            for (let i = 0; i < this.fileTypes.length; i++) {
                logger.trace("Collecting extracted strings from " + this.fileTypes[i].name());
                extracted.addAll(this.fileTypes[i].getExtracted().getBy({
                    sourceLocale: this.sourceLocale
                }).filter((res: Resource) => {
                    // no source means nothing to translate, so don't need those resources
                    return res.source || res.sourceArray || res.sourceStrings;
                }));

                if (this.fileTypes[i].modern && this.fileTypes[i].modern!.size() > 0) {
                    const modernPath = path.join(dir, base + "-modern.xliff");
                    logger.info("Writing out the modern translation strings to " + modernPath);
                    const modernXliff = new Xliff({
                        sourceLocale: this.sourceLocale,
                        pathName: modernPath,
                        version: this.settings.xliffVersion,
                        style: this.settings.xliffStyle
                    });
                    modernXliff.addSet(this.fileTypes[i].modern!);
                    fs.writeFileSync(modernPath, modernXliff.serialize(true), "utf-8");
                }
            }

            // calculate only the new strings and save them to the db
            const newres = this.newres;

            logger.trace("translations is size " + this.translations.size());
            logger.trace("extracted is size " + extracted.size());
            logger.trace("newres is size " + newres.size());

            if (extracted.size()) {
                if (this.settings.convertPlurals) {
                    extracted.convertToICU();
                }
                logger.info("Writing out the extracted strings to " + extractedPath);
                const extractedFile = getIntermediateFile({
                    type: fileFormat,
                    path: extractedPath,
                    sourceLocale: this.sourceLocale,
                    allowDups: this.settings.allowDups,
                    version: this.settings.xliffVersion,
                    style: this.settings.xliffStyle,
                    project: base
                });
                extractedFile.write(extracted);
            } else {
                logger.info("No strings extracted from this run.");
            }

            const newLocales = newres.getLocales();

            if (newLocales && newLocales.length) {
                for (let i = 0; i < newLocales.length; i++) {
                    const locale = newLocales[i];
                    if (!this.isSourceLocale(locale) && !PseudoFactory.isPseudoLocale(locale, this)) {
                        const newPath = path.join(dir, base + "-new-" + locale + "." + getIntermediateFileExtension(fileFormat));
                        const resources = newres.getAll().filter((res: Resource) => {
                            return res.getTargetLocale() === locale && !res.dnt &&
                                (res.source || res.sourceArray || res.sourceStrings);
                        });

                        if (resources && resources.length) {
                            logger.info("Writing out the new strings to " + newPath);
                            const newFile = getIntermediateFile({
                                type: fileFormat,
                                path: newPath,
                                project: base,
                                sourceLocale: this.sourceLocale,
                                targetLocale: locale,
                                version: this.settings.xliffVersion,
                                style: this.settings.xliffStyle
                            });

                            const set = new TranslationSet(this.sourceLocale);
                            resources.forEach((res: Resource) => {
                                if (res.getType() === "plural") {
                                    // adjust the plural categories for the target language
                                    const l = new Locale(locale);
                                    const categories = (pluralCategories as any)[l.getLanguage()];
                                    const sourcePlurals = res.getSourcePlurals();
                                    const targetPlurals: Record<string, string> = {};
                                    categories.forEach((category: string) => {
                                        targetPlurals[category] = (category === "one") ? sourcePlurals.one : sourcePlurals.other;
                                    });
                                    res.setTargetPlurals(targetPlurals);
                                    if (this.settings.convertPlurals) {
                                        res = conversions.convertPluralResToICU(res);
                                    }
                                }
                                set.add(res);
                            });

                            newFile.write(set);
                        } else {
                            logger.info("No new strings to write to " + newPath);
                            if (fs.existsSync(newPath)) {
                                fs.unlinkSync(newPath);
                            }
                        }
                    }
                }
            } else {
                logger.info("No new strings in this run.");
            }
        }

        // now call the plugins in case they need to do anything else
        for (let i = 0; i < this.fileTypes.length; i++) {
            if (typeof(this.fileTypes[i].projectClose) === "function") {
                this.fileTypes[i].projectClose!();
            }
        }

        this.db!.close(() => {
            cb();
        });
    }

    /**
     * Get a project.json configuration
     */
    public getConfig(settings: any): any {
        logger.trace("Project get config");

        return {
            name: this.options.name,
            id: this.options.id || this.options.name,
            sourceLocale: this.sourceLocale,
            pseudoLocale: this.pseudoLocale,
            resourceDirs: settings.resourceDirs,
            includes: [],
            excludes: [
                ".git",
                ".github",
                "test",
                "node_modules",
                "package.json",
                "project.json"
            ],
            settings: {
                locales: ["en-GB", "de-DE", "fr-FR", "it-IT", "es-ES", "pt-BR", "ja-JP", "zh-Hans-CN", "ko-KR"]
            }
        };
    }
}

module.exports = Project;
