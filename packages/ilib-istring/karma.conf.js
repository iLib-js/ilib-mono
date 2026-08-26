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
const { createKarmaConfig } = require("ilib-internal");

const moduleRoot = path.resolve(__dirname);

module.exports = function (config) {
    const karmaConfig = createKarmaConfig({
        webpack: {
            resolve: {
                fallback: {
                    buffer: require.resolve("buffer"),
                },
                alias: {
                    // IString asks LocaleData for "../assembled" in the browser, so
                    // point the calling module at the assembled data built by
                    // build:assemble
                    "calling-module": path.join(moduleRoot, "assembled"),
                    // Avoid bundling NodeLoader and its Node-only dependencies
                    "ilib-loader": "ilib-loader/browser",
                },
            },
        },
    });

    // src/index.js reads import.meta.url to find its locale data on Node, which
    // neither babel nor webpack can handle in a browser bundle on their own
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
