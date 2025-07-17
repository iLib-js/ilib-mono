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
            'test/nodeunit/**/*',
            'test/testSuite.js',
            'test/testSuite.cjs',
            'test/testSuiteWeb.js',
            'test/testSuiteFiles.js',
            'test/testSuite.sh',
            'test/testSuite.html',
            'test/webpack-testSuite.config.cjs',
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

            resolve: {
                fallback: {
                    buffer: require.resolve("buffer")
                },
                alias: {
                    "ilib-loader": "ilib-loader/browser",
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