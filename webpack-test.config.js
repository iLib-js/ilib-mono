/*
 * webpack.config.js - webpack configuration script for testing ilib-localeinfo
 *
 * Copyright © 2022, JEDLSoft
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
var webpack = require('webpack');
var path = require('path');

module.exports = {
    mode: "development",
    entry: "./test/testSuiteWeb.js",
    output: {
        path: path.resolve(__dirname, 'test'),
        filename: "ilib-localeinfo-test.js",
        library: {
            name: "ilibLocaleInfoTest",
            type: "umd"
        }
    },
    externals: {
        "./NodeLoader": "NodeLoader",
        "./QtLoader": "QtLoader",
        "./RhinoLoader": "RhinoLoader",
        "./NashornLoader": "NashornLoader",
        "./RingoLoader": "RingoLoader",
        "log4js": "log4js",
        "nodeunit": "nodeunit"
    },
    devtool: false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: /node_modules\/ilib-/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            minified: false,
                            compact: false,
                            presets: [[
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: {
                                        version: 3,
                                        proposals: true
                                    }
                                }
                            ]],
                            options: {
                                "exclude": [
                                    // \\ for Windows, \/ for Mac OS and Linux
                                    /node_modules[\\\/]core-js/,
                                    /node_modules[\\\/]webpack[\\\/]buildin/,
                                ],
                            },
                            plugins: [
                                "add-module-exports",
                                "@babel/plugin-transform-regenerator"
                            ]
                        }
                    },
                    { loader: '@open-wc/webpack-import-meta-loader' }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            minified: false,
                            compact: false,
                            presets: [[
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: {
                                        version: 3,
                                        proposals: true
                                    }
                                }
                            ]],
                            plugins: [
                                "add-module-exports",
                                "@babel/plugin-transform-regenerator"
                            ]
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        fallback: {
            buffer: require.resolve("buffer")
        },
        alias: {
            "calling-module": "../../../assembled"
        }
    },
    optimization: {
        minimize: false
    }
};
