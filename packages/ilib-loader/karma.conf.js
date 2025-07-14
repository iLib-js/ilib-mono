/*
 * karma.conf.js - configure the karma testing environment
 *
 * Copyright © 2023, 2025 JEDLSoft
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
            "karma-assert"
        ],

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],

        // list of files / patterns to load in the browser
        // Here I'm including all of the the Jest tests which are all under the __tests__ directory.
        // You may need to tweak this patter to find your test files/
        files: [
            "./karma-setup.js",
            "./test/**/*.test.js"
        ],

        // list of files to exclude
        exclude: [
            "./test/NodeLoader.test.js"
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // Use webpack to bundle our tests files
            "./karma-setup.js": ["webpack"],
            "./test/**/*.test.js": ["webpack"],
        },

        browsers: ["ChromeHeadless"],

        webpack: {
            mode: "development",
            target: "web",
            externals: {
                "log4js": "log4js"
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /\/node_modules\//,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                minified: false,
                                compact: false,
                                presets: [[
                                    '@babel/preset-env',
                                    {
                                        "targets": {
                                            "node": process.versions.node,
                                            "browsers": "cover 99.5%"
                                        }
                                    }
                                ]],
                                plugins: [
                                    "add-module-exports",
                                    "@babel/plugin-transform-regenerator"
                                ]
                            }
                        }
                    }
                ]
            },
            resolve: {
                fallback: {
                    buffer: require.resolve("buffer")
                },
                alias: {
                    "calling-module": "../test/locale",
                    "./NodeLoader.js": "./FakeLoader.js",
                    "./QtLoader.js": "./FakeLoader.js",
                    "./RhinoLoader.js": "./FakeLoader.js",
                    "./NashornLoader.js": "./FakeLoader.js",
                    "./RingoLoader.js": "./FakeLoader.js",
                }
            },
        }
    });
};
