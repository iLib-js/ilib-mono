/*
 * karma.config.ts - shared karma configuration for ilib packages
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

import * as os from "os";
import * as fs from "fs";
import { execSync } from "child_process";

/**
 * Simple deep merge function to avoid circular dependency with ilib-common
 * @param target - Target object to merge into
 * @param source - Source object to merge from
 * @returns Merged object
 */
function deepMerge(target: any, source: any): any {
    if (source === null || source === undefined) {
        return target;
    }

    if (typeof source !== "object" || Array.isArray(source)) {
        return source;
    }

    if (typeof target !== "object" || Array.isArray(target)) {
        return source;
    }

    const result = { ...target };

    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (
                typeof source[key] === "object" &&
                !Array.isArray(source[key]) &&
                typeof target[key] === "object" &&
                !Array.isArray(target[key])
            ) {
                result[key] = deepMerge(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
    }

    return result;
}

export interface SharedKarmaConfigOptions {
    files: string[];
    preprocessors: { [pattern: string]: string[] };
    type?: "typescript" | "javascript";
    browsers?: string[];
    webpack?: any;
    [key: string]: any;
}

interface BrowserConfig {
    base: string;
    flags: string[];
}

/**
 * Detects if a browser is installed on the system
 * @param browserName - Name of the browser to check
 * @returns true if browser is installed, false otherwise
 */
function isBrowserInstalled(browserName: string): boolean {
    try {
        const platform = os.platform();

        switch (platform) {
            case "win32":
                // Windows paths
                const windowsPaths: { [key: string]: string } = {
                    chrome: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                    firefox: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
                    opera: "C:\\Program Files\\Opera\\opera.exe",
                    edge: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
                };
                return fs.existsSync(windowsPaths[browserName]);

            case "darwin":
                // macOS paths
                const macPaths: { [key: string]: string } = {
                    chrome: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                    firefox: "/Applications/Firefox.app/Contents/MacOS/firefox",
                    opera: "/Applications/Opera.app/Contents/MacOS/Opera",
                };
                return fs.existsSync(macPaths[browserName]);

            case "linux":
                // Linux - check if executable is in PATH
                try {
                    execSync(`which ${browserName}`, { stdio: "ignore" });
                    return true;
                } catch {
                    return false;
                }

            default:
                return false;
        }
    } catch (error) {
        return false;
    }
}

type BrowserInfo = {
    plugins: string[];
    customLaunchers: { [key: string]: BrowserConfig };
    browsers: string[];
};

/**
 * Detects available browsers based on the current operating system
 * @returns Object with available plugins and custom launchers
 */
export function getAvailableBrowsers(): BrowserInfo {
    const platform = os.platform();
    const plugins = ["karma-webpack", "karma-jasmine", "karma-assert"];

    const customLaunchers: { [key: string]: BrowserConfig } = {};
    const browsers: string[] = [];

    // Cross-platform browsers - only add if installed
    if (isBrowserInstalled("chrome")) {
        plugins.push("karma-chrome-launcher");
        customLaunchers.ChromeHeadless = {
            base: "Chrome",
            flags: ["--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
        };
        browsers.push("ChromeHeadless");
    }

    if (isBrowserInstalled("firefox")) {
        plugins.push("karma-firefox-launcher");
        customLaunchers.FirefoxHeadless = {
            base: "Firefox",
            flags: ["-headless"],
        };
        browsers.push("FirefoxHeadless");
    }

    if (isBrowserInstalled("opera")) {
        plugins.push("karma-opera-launcher");
        customLaunchers.OperaHeadless = {
            base: "Opera",
            flags: ["--headless", "--disable-gpu", "--no-sandbox"],
        };
        browsers.push("OperaHeadless");
    }

    // Platform-specific browsers
    if (platform === "win32" && isBrowserInstalled("edge")) {
        plugins.push("karma-edge-launcher");
        customLaunchers.EdgeHeadless = {
            base: "Edge",
            flags: ["--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
        };
        browsers.push("EdgeHeadless");
    }

    return { plugins, customLaunchers, browsers };
}

/**
 * Exports the browser detection function for debugging purposes
 * @param browserName - Name of the browser to check
 * @returns true if browser is installed, false otherwise
 */
export { isBrowserInstalled };

/**
 * Creates a shared karma configuration that can be extended by individual packages
 *
 * Supported browsers: Chrome, Firefox, Opera (cross-platform) + Edge (Windows)
 * Only browsers that are actually installed on the system will be included
 * Default browsers: All available browsers for the current platform
 *
 * @param options - Package-specific options to merge with the base configuration
 * @returns Merged karma configuration
 */
export function createKarmaConfig(options: SharedKarmaConfigOptions): any {
    // Validate required properties
    if (!options.files || !Array.isArray(options.files) || options.files.length === 0) {
        throw new Error("createKarmaConfig: options.files is required and must be a non-empty array");
    }

    if (!options.preprocessors || typeof options.preprocessors !== "object") {
        throw new Error("createKarmaConfig: options.preprocessors is required and must be an object");
    }

    // Auto-detect TypeScript if not explicitly specified
    const isTypeScript =
        options.type === "typescript" ||
        (options.type !== "javascript" && options.files.some((f) => f.includes(".ts")));

    // Automatically add the shared karma-setup.js file
    const sharedSetupFile = require.resolve("./karma-setup.js");
    const files = [sharedSetupFile, ...options.files];
    const preprocessors = {
        [sharedSetupFile]: ["webpack"],
        ...options.preprocessors,
    };

    // Get available browsers based on OS
    const { plugins, customLaunchers, browsers } = getAvailableBrowsers();

    const baseConfig = {
        plugins: plugins,

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        frameworks: ["jasmine", "webpack"],

        // Custom launchers for cross-platform compatibility
        customLaunchers: customLaunchers,

        // Default browsers - can be overridden
        browsers: options.browsers || browsers,

        // Default webpack configuration
        webpack: {
            mode: "development",
            target: "web",
            externals: {
                log4js: "log4js",
            },
            resolve: {
                extensions: isTypeScript ? [".ts", ".js"] : [".js"],
            },
            module: {
                rules: isTypeScript
                    ? [
                          {
                              test: /\.ts$/,
                              exclude: /\/node_modules\//,
                              use: {
                                  loader: "ts-loader",
                                  options: {
                                      transpileOnly: true,
                                  },
                              },
                          },
                          {
                              test: /\.js$/,
                              exclude: /\/node_modules\//,
                              use: {
                                  loader: "babel-loader",
                                  options: {
                                      minified: false,
                                      compact: false,
                                      presets: [
                                          [
                                              "@babel/preset-env",
                                              {
                                                  targets: {
                                                      node: process.versions.node,
                                                      browsers: "cover 99.5%",
                                                  },
                                              },
                                          ],
                                      ],
                                      plugins: ["add-module-exports"],
                                  },
                              },
                          },
                      ]
                    : [
                          {
                              test: /\.js$/,
                              exclude: /\/node_modules\//,
                              use: {
                                  loader: "babel-loader",
                                  options: {
                                      minified: false,
                                      compact: false,
                                      presets: [
                                          [
                                              "@babel/preset-env",
                                              {
                                                  targets: {
                                                      node: process.versions.node,
                                                      browsers: "cover 99.5%",
                                                  },
                                              },
                                          ],
                                      ],
                                      plugins: ["add-module-exports"],
                                  },
                              },
                          },
                      ],
            },
        },
    };

    // Merge package-specific options with base configuration
    const mergedConfig = deepMerge(baseConfig, {
        ...options,
        files: files,
        preprocessors: preprocessors,
    });

    return mergedConfig;
}

/**
 * Helper function to create a karma configuration file for a package
 *
 * @param options - Package-specific configuration options
 * @returns A function that can be used as karma.config.js
 */
export function createKarmaConfigFunction(
    options: SharedKarmaConfigOptions = {} as SharedKarmaConfigOptions
): (config: any) => void {
    return function (config: any) {
        config.set(createKarmaConfig(options));
    };
}
