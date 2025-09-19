const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        // Package-specific files to load (shared karma-setup.js is added automatically)
        files: [
            "./test/**/*.test.js"
        ],

        // Package-specific preprocessors
        preprocessors: {
            "./test/**/*.test.js": ["webpack"],
        },

        // Additional webpack configuration specific to this package
        webpack: {
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
    }));
};
