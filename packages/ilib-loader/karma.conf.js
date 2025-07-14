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
const { createKarmaConfig } = require("ilib-internal");

module.exports = function (config) {
    config.set(
        createKarmaConfig({
            // Additional webpack configuration specific to this package
            webpack: {
                module: {
                    rules: [
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
                                    plugins: ["add-module-exports", "@babel/plugin-transform-regenerator"],
                                },
                            },
                        },
                    ],
                },
                resolve: {
                    fallback: {
                        buffer: require.resolve("buffer"),
                    },
                    alias: {
                        "calling-module": "../test/locale",
                        "./NodeLoader.js": "./FakeLoader.js",
                        "./QtLoader.js": "./FakeLoader.js",
                        "./RhinoLoader.js": "./FakeLoader.js",
                        "./NashornLoader.js": "./FakeLoader.js",
                        "./RingoLoader.js": "./FakeLoader.js",
                    },
                },
            },
        })
    );
};
