/*
 * karma.conf.js - configure the karma testing environment
 * This package uses the shared karma configuration from ilib-internal
 *
 * Copyright © 2026 JEDLSoft
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

const path = require("path");
const webpack = require("webpack");
const { createKarmaConfig } = require("ilib-internal");

const moduleRoot = path.resolve(__dirname);

module.exports = function (config) {
    const karmaConfig = createKarmaConfig({
        webpack: {
            plugins: [
                // Strip the LocaleData root prefix so dynamic imports resolve to
                // assembled/<locale>.js via the calling-module alias (not locale/<locale>.js).
                new webpack.DefinePlugin({
                    __CALLING_MODULE_PATH__: JSON.stringify("./locale"),
                }),
            ],
            resolve: {
                fallback: {
                    buffer: false,
                },
                alias: {
                    "calling-module": path.join(moduleRoot, "assembled"),
                    // Avoid bundling NodeLoader and its Node-only dependencies
                    "ilib-loader": path.join(moduleRoot, "../ilib-loader/src/index-browser.js"),
                },
            },
        },
    });

    // Company policy: do not launch Opera even if it is installed
    karmaConfig.browsers = (karmaConfig.browsers || []).filter(
        (browser) => !String(browser).toLowerCase().includes("opera")
    );
    karmaConfig.plugins = (karmaConfig.plugins || []).filter(
        (plugin) => plugin !== "karma-opera-launcher"
    );
    if (karmaConfig.customLaunchers) {
        delete karmaConfig.customLaunchers.OperaHeadless;
    }

    const jsRule = karmaConfig.webpack.module.rules.find(
        (rule) => rule.test && rule.test.toString().includes("\\.js")
    );
    if (jsRule && jsRule.use) {
        jsRule.use = [
            {
                loader: "babel-loader",
                options: {
                    ...jsRule.use.options,
                    plugins: [
                        ...(jsRule.use.options?.plugins || []),
                        "babel-plugin-transform-import-meta",
                        "@babel/plugin-transform-regenerator",
                    ],
                },
            },
            { loader: "@open-wc/webpack-import-meta-loader" },
        ];
    }

    config.set(karmaConfig);
};
