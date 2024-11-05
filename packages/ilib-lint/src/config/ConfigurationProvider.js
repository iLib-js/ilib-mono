/*
 * ConfigurationProvider.js - Configuration provider of the linter
 *
 * Copyright © 2023-2024 JEDLSoft
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
/** @ignore @typedef {import("./Configuration.js").Configuration} Configuration */

import fs from "node:fs/promises";
import path from "node:path";
import log4js from "log4js";
import JSON5 from "json5";

/**
 * Loads a linter {@link Configuration} from file
 *
 * @interface
 */
export class ConfigurationProvider {
    /**
     * @returns {Promise<Configuration>}
     * @interface
     */
    async loadConfiguration() {
        throw new Error("not implemented");
    }
}

/** @implements {ConfigurationProvider} */
export class FileConfigurationProvider {
    static logger = log4js.getLogger("ilib-lint.FileConfigurationProvider");

    /** @private @readonly */ filePath;

    /** @param {string} filePath File to load configuration from */
    constructor(filePath) {
        this.filePath = filePath;
    }

    /** @protected */
    async loadJsonConfiguration() {
        const content = await fs.readFile(this.filePath, "utf-8");
        return JSON5.parse(content);
    }

    /** @protected */
    async loadJsConfiguration() {
        return (await import(path.resolve(this.filePath))).default;
    }

    async loadConfiguration() {
        let /** @type {unknown} */ configuration;
        switch (path.extname(this.filePath).toLowerCase()) {
            case ".js":
            case ".cjs":
            case ".mjs":
                configuration = await this.loadJsConfiguration();
                break;
            case ".json":
                configuration = await this.loadJsonConfiguration();
                break;
            default:
                throw new Error("unsupported configuration file extension");
        }

        // TODO add config validation

        return /** @type {Configuration} */ (configuration);
    }
}

/** @implements {ConfigurationProvider} */
export class FolderConfigurationProvider {
    static logger = log4js.getLogger("ilib-lint.FolderConfigurationProvider");

    /** @param {string} folderPath Folder in which to look for a configuration */
    constructor(folderPath) {
        this.folderPath = folderPath;
    }

    /** @private @readonly */ folderPath;

    /**
     * Configuration files ordered by load priority
     *
     * @private @readonly
     */
    configurationFileNamesByPriority = [
        "ilib-lint-config.js",
        "ilib-lint-config.mjs",
        "ilib-lint-config.cjs",
        "ilib-lint-config.json"
    ];

    /** @private */
    async findConfigurationFile() {
        const entries = await fs.readdir(this.folderPath);
        return this.configurationFileNamesByPriority.find((c) =>
            entries.includes(c)
        );
    }

    /**
     * Check if set folder has a configuration file
     *
     * @returns {Promise<boolean>}
     */
    async hasConfigurationFile() {
        return (await this.findConfigurationFile()) !== undefined;
    }

    async loadConfiguration() {
        const fileName = await this.findConfigurationFile();
        if (!fileName) {
            throw new Error("no configuration file available");
        }
        const filePath = path.join(this.folderPath, fileName);

        FolderConfigurationProvider.logger.debug(
            `Loading confiugration from file ${filePath}`
        );

        return await new FileConfigurationProvider(
            filePath
        ).loadConfiguration();
    }
}
