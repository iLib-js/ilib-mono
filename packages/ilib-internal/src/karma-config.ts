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
import { execFileSync, execSync } from "child_process";

// how long to wait for the check that a browser is intact before giving up on it
const browserCheckTimeout = 10000;

// name of the environment variable that lists browsers to leave out of the test
// run, for example when IT policy does not allow one of them to be launched
const skipBrowsersVariable = "KARMA_SKIP_BROWSERS";

const defaultFiles = ["./test/**/*.test.js"];
const defaultFilesTS = ["./test/**/*.test.ts"];

const defaultPreprocessors = {
    "./test/**/*.test.js": ["webpack"],
};
const defaultPreprocessorsTS = {
    "./test/**/*.test.ts": ["webpack"],
};

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
    files?: string[];
    preprocessors?: { [pattern: string]: string[] };
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
 * Finds the executable for the given browser on this system
 * @param browserName - Name of the browser to look for
 * @returns the path to the executable, or undefined if it cannot be found
 */
function getBrowserExecutable(browserName: string): string | undefined {
    try {
        const platform = os.platform();

        switch (platform) {
            case "win32": {
                // Windows paths
                const windowsPaths: { [key: string]: string } = {
                    chrome: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                    firefox: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
                    opera: "C:\\Program Files\\Opera\\opera.exe",
                    edge: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
                };
                const executable = windowsPaths[browserName];
                return executable && fs.existsSync(executable) ? executable : undefined;
            }

            case "darwin": {
                // macOS paths
                const macPaths: { [key: string]: string } = {
                    chrome: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                    firefox: "/Applications/Firefox.app/Contents/MacOS/firefox",
                    opera: "/Applications/Opera.app/Contents/MacOS/Opera",
                };
                const executable = macPaths[browserName];
                return executable && fs.existsSync(executable) ? executable : undefined;
            }

            case "linux": {
                // Linux - find the executable in the PATH
                const executable = execSync(`which ${browserName}`, {
                    encoding: "utf-8",
                    stdio: ["ignore", "pipe", "ignore"],
                }).trim();
                return executable || undefined;
            }

            default:
                return undefined;
        }
    } catch (error) {
        return undefined;
    }
}

/**
 * Detects if a browser is installed on the system
 * @param browserName - Name of the browser to check
 * @returns true if browser is installed, false otherwise
 */
function isBrowserInstalled(browserName: string): boolean {
    return getBrowserExecutable(browserName) !== undefined;
}

/**
 * Detects if the given browser was listed in the KARMA_SKIP_BROWSERS environment
 * variable. Use that variable for browsers that are installed and intact but still
 * cannot be launched, such as when IT policy blocks that software. There is no way
 * to detect such a policy, and launching the browser to find out would trigger the
 * very notification that the policy shows when it blocks an application.
 *
 * @param browserName - Name of the browser to check
 * @returns true if this browser should be left out of the test run
 */
function isBrowserSkipped(browserName: string): boolean {
    const skipped = process.env[skipBrowsersVariable];
    if (!skipped) {
        return false;
    }

    return skipped
        .split(",")
        .map((name) => name.trim().toLowerCase())
        .some((name) => name === browserName || name === `${browserName}headless`);
}

/**
 * Detects if a macOS application bundle is intact. A partially applied update can
 * leave a bundle that macOS refuses to run, which karma reports only as a browser
 * that cannot start. Verifying the code signature catches that without launching
 * the application.
 *
 * @param executable - Path to the executable inside the application bundle
 * @returns true if the bundle verifies, or if the executable is not in a bundle
 */
function isMacAppIntact(executable: string): boolean {
    const bundleEnd = executable.indexOf(".app/");
    if (bundleEnd === -1) {
        return true;
    }
    const bundle = executable.slice(0, bundleEnd + ".app".length);

    try {
        execFileSync("codesign", ["--verify", bundle], {
            stdio: "ignore",
            timeout: browserCheckTimeout,
        });
        return true;
    } catch (error) {
        // if codesign itself is not available, there is nothing to conclude about
        // the bundle, so give it the benefit of the doubt
        return (error as NodeJS.ErrnoException).code === "ENOENT";
    }
}

// remember the results so that each browser is only checked once per process
const usableBrowsers: { [browserName: string]: boolean } = {};

/**
 * Detects if a browser is installed and can be used for testing. Being installed is
 * not enough, because karma fails the entire run when it cannot launch a browser
 * that it was configured to use.
 *
 * @param browserName - Name of the browser to check
 * @returns true if the browser can be used for testing, false otherwise
 */
function isBrowserUsable(browserName: string): boolean {
    if (typeof usableBrowsers[browserName] === "boolean") {
        return usableBrowsers[browserName];
    }

    let usable = false;

    if (!isBrowserSkipped(browserName)) {
        const executable = getBrowserExecutable(browserName);
        if (executable) {
            usable = os.platform() !== "darwin" || isMacAppIntact(executable);
            if (!usable) {
                console.warn(
                    `Skipping ${browserName}: its code signature does not verify, so macOS ` +
                    `will not run it. Reinstall it, or set ${skipBrowsersVariable}=${browserName} ` +
                    `to skip it without this warning.`
                );
            }
        }
    }

    usableBrowsers[browserName] = usable;
    return usable;
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

    // Cross-platform browsers - only add if they can be used for testing
    if (isBrowserUsable("chrome")) {
        plugins.push("karma-chrome-launcher");
        customLaunchers.ChromeHeadless = {
            base: "Chrome",
            flags: ["--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
        };
        browsers.push("ChromeHeadless");
    }

    if (isBrowserUsable("firefox")) {
        plugins.push("karma-firefox-launcher");
        customLaunchers.FirefoxHeadless = {
            base: "Firefox",
            flags: ["-headless"],
        };
        browsers.push("FirefoxHeadless");
    }

    if (isBrowserUsable("opera")) {
        plugins.push("karma-opera-launcher");
        customLaunchers.OperaHeadless = {
            base: "Opera",
            flags: ["--headless", "--disable-gpu", "--no-sandbox"],
        };
        browsers.push("OperaHeadless");
    }

    // Platform-specific browsers
    if (platform === "win32" && isBrowserUsable("edge")) {
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
 * Exports the browser detection functions for debugging purposes
 */
export { isBrowserInstalled, isBrowserUsable, getBrowserExecutable };

/**
 * Creates a shared karma configuration that can be extended by individual packages
 *
 * Supported browsers: Chrome, Firefox, Opera (cross-platform) + Edge (Windows)
 * Only browsers that are installed, intact, and not listed in the KARMA_SKIP_BROWSERS
 * environment variable will be included
 * Default browsers: All available browsers for the current platform
 *
 * @param options - Package-specific options to merge with the base configuration
 * @returns Merged karma configuration
 */
export function createKarmaConfig(options: SharedKarmaConfigOptions = {} as SharedKarmaConfigOptions): any {
    // Auto-detect TypeScript if not explicitly specified
    const isTypeScript =
        options.type === "typescript" ||
        (options.type !== "javascript" && options.files?.some((f) => f.includes(".ts")));

    if (!options.files) {
        options.files = isTypeScript ? defaultFilesTS : defaultFiles;
    }

    if (!options.preprocessors) {
        options.preprocessors = isTypeScript ? defaultPreprocessorsTS : defaultPreprocessors;
    }

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
