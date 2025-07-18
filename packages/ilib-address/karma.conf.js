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

module.exports = function(config) {
    config.set({
        plugins: [
            "karma-webpack",
            "karma-jasmine",
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-assert"
        ],
        basePath: '',
        frameworks: ['jasmine', 'webpack'],
        files: [
            'karma-setup.js',
            'test/*.test.js'
        ],
        exclude: [
            'test/package.json'
        ],
        preprocessors: {
            'karma-setup.js': ['webpack'],
            'test/*.test.js': ['webpack']
        },
        webpack: {
            mode: 'development',
            target: 'web',
            entry: {
                test: './karma-setup.js'
            },
            externals: {
                "log4js": "log4js"
            },
            optimization: {
                moduleIds: 'named',
                chunkIds: 'named'
            },
            resolve: {
                fallback: {
                    buffer: require.resolve("buffer")
                },
                alias: {
                    "ilib-loader": "ilib-loader/browser",
                    "ilib-localedata": require('path').resolve(__dirname, "../ilib-localedata/src"),
                    "ilib-locale": require('path').resolve(__dirname, "../ilib-locale/src/Locale.js"),
                    "ilib-common": require('path').resolve(__dirname, "../ilib-common/src"),
                    "ilib-env": require('path').resolve(__dirname, "../ilib-env/src"),
                    "ilib-istring": require('path').resolve(__dirname, "../ilib-istring/src"),
                    "calling-module": require('path').resolve(__dirname, "assembled")
                },
                extensions: ['.js', '.json']
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        include: require('path').resolve(__dirname, "assembled"),
                        type: "javascript/auto"
                    }
                ]
            }
        },
        reporters: ['progress', 'coverage'],
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/',
            subdir: 'browser'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['ChromeHeadless', 'FirefoxHeadless'],
        singleRun: true,
        concurrency: Infinity
    });
}; 