/*
 * webpack.config.js - webpack configuration script for ilib-env
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
var webpack = require("webpack");
var path = require("path");
var moduleRoot = path.resolve(__dirname, "..");

module.exports = {
    mode: "development",
    entry: path.join(moduleRoot, "test/testSuiteWeb.js"),
    output: {
        path: path.join(moduleRoot, "test-web"),
        filename: "ilib-istring-test.js",
        library: {
            name: "ilibIStringTest",
            type: "umd",
        },
    },
    externals: {
        "./NodeLoader.js": "NodeLoader",
        "./QtLoader.js": "QtLoader",
        "./RhinoLoader.js": "RhinoLoader",
        "./NashornLoader.js": "NashornLoader",
        "./RingoLoader.js": "RingoLoader",
        log4js: "log4js",
        nodeunit: "nodeunit",
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
                        loader: "babel-loader",
                        options: {
                            minified: false,
                            compact: false,
                            presets: ["@babel/preset-env"],
                            options: {
                                exclude: [
                                    // \\ for Windows, \/ for Mac OS and Linux
                                    /node_modules[\\\/]webpack[\\\/]buildin/,
                                ],
                            },
                            plugins: ["add-module-exports", "@babel/plugin-transform-regenerator"],
                        },
                    },
                    { loader: "@open-wc/webpack-import-meta-loader" },
                ],
            },
        ],
    },
    resolve: {
        fallback: {
            buffer: require.resolve("buffer"),
        },
        alias: {
            "calling-module": path.join(moduleRoot, "assembled"),
        },
    },
    optimization: {
        minimize: false,
    },
};
