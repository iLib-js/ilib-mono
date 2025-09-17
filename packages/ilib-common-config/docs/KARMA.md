# Karma Configuration

This package provides a shared Karma configuration for all ilib packages, allowing you to maintain consistent testing setup while customizing package-specific needs. The configuration uses `ilib-common`'s merge functionality for deep configuration merging and automatically detects TypeScript vs JavaScript packages.

## Usage

### Basic Usage

Create a `karma.conf.js` file in your package root:

```javascript
const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        // Required: Package-specific files to load
        // Note: shared karma-setup.cjs is automatically included
        files: [
            "./test/**/*.test.js"
        ],

        // Required: Package-specific preprocessors
        preprocessors: {
            "./test/**/*.test.js": ["webpack"],
        }
    }));
};
```

### TypeScript Package Usage

For TypeScript packages, the configuration automatically detects `.ts` files and configures appropriate loaders:

```javascript
const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        // TypeScript files are auto-detected
        // Note: shared karma-setup.cjs is automatically included
        files: [
            "./test/**/*.test.ts"
        ],

        preprocessors: {
            "./test/**/*.test.ts": ["webpack"],
        }
    }));
};
```

### Advanced Usage

You can override any configuration option. The shared configuration uses deep merging, so you can override specific webpack settings without replacing the entire configuration:

```javascript
const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        // Override browsers for specific package needs
        browsers: ["ChromeHeadless"],
        
        // Required: Package-specific files
        // Note: shared karma-setup.cjs is automatically included
        files: [
            "./test/**/*.test.js",
            "./src/**/*.js"  // Include source files if needed
        ],

        // Required: Package-specific preprocessors
        preprocessors: {
            "./test/**/*.test.js": ["webpack"],
            "./src/**/*.js": ["webpack"]
        },

        // Additional webpack configuration (merged with base config)
        webpack: {
            externals: {
                "log4js": "log4js"  // Example: exclude from bundle
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
    }));
};
```

## Automatic Setup File Inclusion

The shared configuration automatically includes the `karma-setup.js` file from `../ilib-common-config/karma-setup.js`, which provides Jest-compatible functions for browser testing. You don't need to manually include it in your files array - it's added automatically as the first file.

## Required Properties

The `createKarmaConfig` function validates that you provide:

- **`files`**: Array of file patterns to load in the browser (must be non-empty)
- **`preprocessors`**: Object mapping file patterns to preprocessor arrays

If either is missing or invalid, the function will throw a clear error message.

## Automatic Environment Detection

The configuration automatically detects your package type:

- **TypeScript packages**: Detected by `.ts` files in the `files` array
- **JavaScript packages**: Detected by `.js` files only

Based on detection, it configures:
- **Webpack extensions**: `['.ts', '.js']` for TypeScript, `['.js']` for JavaScript
- **Loaders**: `ts-loader` + `babel-loader` for TypeScript, `babel-loader` only for JavaScript

## Default Configuration

The shared configuration provides:

- **Plugins**: karma-webpack, karma-jasmine, karma-chrome-launcher, karma-firefox-launcher, karma-assert
- **Frameworks**: Jasmine
- **Browsers**: ChromeHeadless, FirefoxHeadless
- **Webpack**: 
  - Mode: development
  - Target: web
  - Automatic loader configuration based on file types
- **Base Path**: Empty string (current directory)

## Package Dependencies

Make sure your package has the required dependencies:

```json
{
  "devDependencies": {
    "ilib-common-config": "workspace:*",
    "karma": "^6.4.0",
    "karma-webpack": "^5.0.0",
    "ts-loader": "^9.0.0",
    "babel-loader": "^9.0.0",
    "@babel/preset-env": "^7.0.0"
  }
}
```

## Migration from Individual Configs

To migrate from an existing karma configuration:

1. Add `ilib-common-config` as a devDependency
2. Replace your `config.set()` call with `createKarmaConfig()`
3. Keep only package-specific settings (files, preprocessors, custom webpack rules)
4. Remove shared configuration (plugins, frameworks, browsers, base webpack config)
5. Remove any karma-setup files from your files array (automatically included)

Example migration:

**Before:**
```javascript
module.exports = function (config) {
    config.set({
        plugins: ["karma-webpack", "karma-jasmine", "karma-chrome-launcher", "karma-assert"],
        frameworks: ["jasmine"],
        browsers: ["ChromeHeadless"],
        files: ["./test/**/*.test.js"],
        preprocessors: { "./test/**/*.test.js": ["webpack"] },
        webpack: { 
            mode: "development",
            target: "web",
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /\/node_modules\//,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            }
        }
    });
};
```

**After:**
```javascript
const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        files: ["./test/**/*.test.js"],
        preprocessors: { "./test/**/*.test.js": ["webpack"] }
    }));
};
```

## Real-World Example

Here's how `ilib-locale` uses the shared configuration:

```javascript
const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        files: [
            "./test/**/*.test.js"
        ],
        preprocessors: {
            "./test/**/*.test.js": ["webpack"],
        },
        browsers: ["ChromeHeadless"],  // Override default browsers
        webpack: {
            externals: {
                "log4js": "log4js"  // Package-specific external
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
                                plugins: ["add-module-exports"]
                            }
                        }
                    }
                ]
            }
        }
    }));
};
```

This configuration successfully runs 178 tests with the shared setup! 🎉
