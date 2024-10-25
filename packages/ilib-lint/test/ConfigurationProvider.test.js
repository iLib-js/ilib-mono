/*
 * ConfigurationProvider.test.js
 *
 * Copyright © 2023 JEDLSoft
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

import {
    FileConfigurationProvider,
    FolderConfigurationProvider
} from "../src/config/ConfigurationProvider.js";

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const jsonConfig = `{
    "name": "configuration-provider-test-json-config",
    "plugins": [
        "ilib-lint-plugin-test"
    ],
    "locales": [
        "en-US",
        "de-DE"
    ]
}`;

const cjsConfig = `module.exports = {
    "name": "configuration-provider-test-cjs-config",
    "plugins": [
        "ilib-lint-plugin-test"
    ],
    "locales": [
        "en-US",
        "de-DE"
    ]
};`;

const esmConfig = `export default {
    "name": "configuration-provider-test-esm-config",
    "plugins": [
        "ilib-lint-plugin-test"
    ],
    "locales": [
        "en-US",
        "de-DE"
    ]
};`;

const esmPackage = `{
    "type": "module"
}`;

describe("Configuration Provider", () => {
    let tempDir;
    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "ilib-lint-test-"));
    });
    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true });
    });
    describe("File Configuration Provider", () => {
        test("load config from JSON file", async () => {
            // should successfully import the JSON config file

            // setup - write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.json`);
            await fs.writeFile(configPath, jsonConfig);

            // test
            const provider = new FileConfigurationProvider(configPath);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-json-config");
        });

        test("load config from CJS file", async () => {
            // should successfully import the JS config file from a CommonJS package

            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.js`);
            await fs.writeFile(configPath, cjsConfig);

            // test
            const provider = new FileConfigurationProvider(configPath);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-cjs-config");
        });

        test("load config from CJS file using relative path", async () => {
            // should successfully import the JS config file from a CommonJS package

            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.js`);
            await fs.writeFile(configPath, cjsConfig);

            // get config path relative to CWD
            const relativeConfigPath = path.relative(process.cwd(), configPath);

            // test
            const provider = new FileConfigurationProvider(relativeConfigPath);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-cjs-config");
        });

        test("load config from ESM file", async () => {
            // should successfully import the JS config file from an ESM package

            // first set package mode to ESM
            const packagePath = path.join(tempDir, `package.json`);
            await fs.writeFile(packagePath, esmPackage);

            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.js`);
            await fs.writeFile(configPath, esmConfig);

            // test
            const provider = new FileConfigurationProvider(configPath);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-esm-config");
        });

        test("load config from ESM file using relative path", async () => {
            // should successfully import the JS config file from an ESM package

            // first set package mode to ESM
            const packagePath = path.join(tempDir, `package.json`);
            await fs.writeFile(packagePath, esmPackage);

            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.js`);
            await fs.writeFile(configPath, esmConfig);

            // get config path relative to CWD
            const relativeConfigPath = path.relative(process.cwd(), configPath);

            // test
            const provider = new FileConfigurationProvider(relativeConfigPath);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-esm-config");
        });

        test("load config from CJS file in ESM package", async () => {
            // should successfully import the JS config file in a CommonJS format existing in an ESM package
            // (provided that it has appropriate extension)

            // first set package mode to ESM
            const packagePath = path.join(tempDir, `package.json`);
            await fs.writeFile(packagePath, esmPackage);
            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.cjs`);
            await fs.writeFile(configPath, cjsConfig);

            // test
            const provider = new FileConfigurationProvider(configPath);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-cjs-config");
        });

        test("load config from CJS file in ESM package without .cjs extension", async () => {
            // attempting to load a CJS file placed in an ESM package should throw

            // first set package mode to ESM
            const packagePath = path.join(tempDir, `package.json`);
            await fs.writeFile(packagePath, esmPackage);
            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.js`);
            await fs.writeFile(configPath, cjsConfig);

            // test
            const provider = new FileConfigurationProvider(configPath);

            expect(provider.loadConfiguration()).rejects.toThrow();
        });

        test("load config from ESM file in CJS package", async () => {
            // should successfully import the JS config file in an ESM format existing in a CJS package
            // (provided that it has appropriate extension)

            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.mjs`);
            await fs.writeFile(configPath, esmConfig);

            // test
            const provider = new FileConfigurationProvider(configPath);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-esm-config");
        });

        test("load config from ESM file in CJS package without .mjs extension", async () => {
            // attempting to load an ESM file placed in a CJS package should throw

            // do not set package mode to ESM

            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.js`);
            await fs.writeFile(configPath, esmConfig);

            // test
            const provider = new FileConfigurationProvider(configPath);

            expect(provider.loadConfiguration()).rejects.toThrow();
        });
    });

    describe("Folder Configuration Provider", () => {
        test("load config from JSON file", async () => {
            // should successfully import the JSON config file placed in a project root

            // setup - write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.json`);
            await fs.writeFile(configPath, jsonConfig);

            // test
            const provider = new FolderConfigurationProvider(tempDir);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-json-config");
        });

        test("load config from CJS file", async () => {
            // should successfully import the JS config file from a CommonJS package

            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.js`);
            await fs.writeFile(configPath, cjsConfig);

            // test
            const provider = new FolderConfigurationProvider(tempDir);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-cjs-config");
        });

        test("load config from ESM file", async () => {
            // should successfully import the JS config file from an ESM package

            // first set package mode to ESM
            const packagePath = path.join(tempDir, `package.json`);
            await fs.writeFile(packagePath, esmPackage);

            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.js`);
            await fs.writeFile(configPath, esmConfig);

            // test
            const provider = new FolderConfigurationProvider(tempDir);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-esm-config");
        });

        test("load config from CJS file in ESM package", async () => {
            // should successfully import the JS config file in a CommonJS format existing in an ESM package
            // (provided that it has appropriate extension)

            // first set package mode to ESM
            const packagePath = path.join(tempDir, `package.json`);
            await fs.writeFile(packagePath, esmPackage);
            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.cjs`);
            await fs.writeFile(configPath, cjsConfig);

            // test
            const provider = new FolderConfigurationProvider(tempDir);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-cjs-config");
        });

        test("load config from MJS file in CJS package", async () => {
            // should successfully import the JS config file in an ESM format existing in a CJS package
            // (provided that it has appropriate extension)

            // write config to file
            const configPath = path.join(tempDir, `ilib-lint-config.mjs`);
            await fs.writeFile(configPath, esmConfig);

            // test
            const provider = new FolderConfigurationProvider(tempDir);
            const result = await provider.loadConfiguration();

            expect(result.name).toBe("configuration-provider-test-esm-config");
        });

        test("prioritize JS config when there is both JS and JSON config available", async () => {
            // should import the JS config file when there are both JS and JSON configs in given folder

            // write JS config
            await fs.writeFile(
                path.join(tempDir, `ilib-lint-config.js`),
                cjsConfig
            );
            // write JSON config
            await fs.writeFile(
                path.join(tempDir, `ilib-lint-config.json`),
                jsonConfig
            );

            // test
            const provider = new FolderConfigurationProvider(tempDir);
            const result = await provider.loadConfiguration();

            // should load JS config here
            expect(result.name).toBe("configuration-provider-test-cjs-config");
        });
    });
});
