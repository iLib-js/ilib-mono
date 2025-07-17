/*
 * karma.conf.js - configure the karma testing environment
 *
 * Copyright © 2025, JEDLSoft
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
        // Only test the simplified browser test for now
        files: [
            "./karma-setup.js",
            "./test/browser-test.js"
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // Use webpack to bundle our tests files
            "./karma-setup.js": ["webpack"],
            "./test/browser-test.js": ["webpack"],
        },

        browsers: ["ChromeHeadless"],
        
        webpack: {
            mode: "development",
            target: "web",
            externals: {
                "log4js": "log4js"
            },
            resolve: {
                fallback: {
                    "fs": false,
                    "path": false,
                    "crypto": false,
                    "os": false,
                    "util": false,
                    "stream": false,
                    "events": false,
                    "assert": false,
                    "buffer": false,
                    "url": false,
                    "querystring": false,
                    "http": false,
                    "https": false,
                    "zlib": false,
                    "tty": false,
                    "child_process": false,
                    "cluster": false,
                    "dgram": false,
                    "dns": false,
                    "domain": false,
                    "module": false,
                    "net": false,
                    "punycode": false,
                    "readline": false,
                    "repl": false,
                    "string_decoder": false,
                    "sys": false,
                    "timers": false,
                    "tls": false,
                    "tty": false,
                    "v8": false,
                    "vm": false,
                    "worker_threads": false
                }
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
                                    "add-module-exports"
                                ]
                            }
                        }
                    }
                ]
            }
        }
    });
}; 