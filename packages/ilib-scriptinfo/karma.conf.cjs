/*
 * karma.conf.cjs - configure the karma testing environment
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
var path = require('path');

module.exports = function (config) {
    config.set({
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
        frameworks: ["jasmine"],

        // list of files / patterns to load in the browser
        files: [
            "./karma-setup.cjs",
            "./test/ScriptInfo.test.ts"
        ],

        // preprocess matching files before serving them to the browser
        preprocessors: {
            "./karma-setup.cjs": ["webpack"],
            "./test/ScriptInfo.test.ts": ["webpack"],
        },

        browsers: ["ChromeHeadless", "FirefoxHeadless"],
        
        webpack: {
            mode: "development",
            target: "web",
            resolve: {
                extensions: ['.ts', '.js']
            },
            module: {
                rules: [
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
                ]
            }
        }
    });
}; 