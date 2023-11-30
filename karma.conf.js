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
                                            "node": "current",
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
