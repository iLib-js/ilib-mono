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

// @ts-ignore - ilib-common doesn't have TypeScript declarations
import { JSUtils } from 'ilib-common';

export interface SharedKarmaConfigOptions {
    files: string[];
    preprocessors: { [pattern: string]: string[] };
    type?: 'typescript' | 'javascript';
    browsers?: string[];
    webpack?: any;
    [key: string]: any;
}

/**
 * Creates a shared karma configuration that can be extended by individual packages
 * 
 * @param options - Package-specific options to merge with the base configuration
 * @returns Merged karma configuration
 */
export function createKarmaConfig(options: SharedKarmaConfigOptions): any {
    // Validate required properties
    if (!options.files || !Array.isArray(options.files) || options.files.length === 0) {
        throw new Error('createKarmaConfig: options.files is required and must be a non-empty array');
    }
    
    if (!options.preprocessors || typeof options.preprocessors !== 'object') {
        throw new Error('createKarmaConfig: options.preprocessors is required and must be an object');
    }

    // Auto-detect TypeScript if not explicitly specified
    const isTypeScript = options.type === 'typescript' || 
                        (options.type !== 'javascript' && options.files.some(f => f.includes('.ts')));

    // Automatically add the shared karma-setup.js file
    const sharedSetupFile = '../ilib-common-config/karma-setup.js';
    const files = [sharedSetupFile, ...options.files];
    const preprocessors = {
        [sharedSetupFile]: ['webpack'],
        ...options.preprocessors
    };

    const baseConfig = {
        plugins: [
            "karma-webpack",
            "karma-jasmine", 
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-assert"
        ],

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        frameworks: ["jasmine", "webpack"],

        // Default browsers - can be overridden
        browsers: options.browsers || ["ChromeHeadless", "FirefoxHeadless"],
        
        // Default webpack configuration
        webpack: {
            mode: "development",
            target: "web",
            resolve: {
                extensions: isTypeScript ? ['.ts', '.js'] : ['.js']
            },
            module: {
                rules: isTypeScript ? [
                    {
                        test: /\.ts$/,
                        exclude: /\/node_modules\//,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true
                            }
                        }
                    },
                    {
                        test: /\.js$/,
                        exclude: /\/node_modules\//,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ] : [
                    {
                        test: /\.js$/,
                        exclude: /\/node_modules\//,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            }
        }
    };

    // Merge package-specific options with base configuration
    const mergedConfig = JSUtils.merge(baseConfig, {
        ...options,
        files: files,
        preprocessors: preprocessors
    });
    
    return mergedConfig;
}

/**
 * Helper function to create a karma configuration file for a package
 * 
 * @param options - Package-specific configuration options
 * @returns A function that can be used as karma.config.js
 */
export function createKarmaConfigFunction(options: SharedKarmaConfigOptions = {} as SharedKarmaConfigOptions): (config: any) => void {
    return function(config: any) {
        config.set(createKarmaConfig(options));
    };
}
