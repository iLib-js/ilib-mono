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
        // Note: shared karma-setup.js is automatically included
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

Your local karma.conf.js only needs to define the files and the preprocessors properties and you are ready to start testing!

### TypeScript Package Usage

For TypeScript packages, the configuration automatically detects `.ts` files in the `files` property and configures appropriate loaders.

### Advanced Usage

You can override any configuration option. The shared configuration uses deep merging, so you can override specific webpack settings without replacing the entire configuration. Example:

```javascript
const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        // Override browsers for specific package needs
        browsers: ["ChromeHeadless"],

        // Required: Package-specific files
        // Note: shared karma-setup.js is automatically included
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

The full list of properties you can put into the karma configuration file is documented [here](https://karma-runner.github.io/6.4/config/configuration-file.html).

## Automatic Setup File Inclusion

The shared configuration automatically includes the `karma-setup.js` file from `../ilib-common-config/karma-setup.js`, which provides Jest-compatible functions for browser testing. You don't need to manually include it in your files array - it's added automatically as the first file.

## Required Properties

The `createKarmaConfig` function validates that you provide:

- **`files`**: Array of file patterns to load in the browser (must be non-empty)
- **`preprocessors`**: Object mapping file patterns to preprocessor arrays

If either is missing or invalid, the function will throw a clear error message.

## Automatic Environment Detection

The configuration automatically detects your package type:

- **TypeScript packages**: Detected by finding `.ts` files in the `files` array
- **JavaScript packages**: Detected by finding `.js` files only

Based on detection, it configures:
- **Webpack extensions**: `['.ts', '.js']` for TypeScript, `['.js']` for JavaScript
- **Loaders**: `ts-loader` + `babel-loader` for TypeScript, `babel-loader` only for JavaScript
- **Babel configuration**: Comprehensive preset with Node.js and browser targets
- **Externals**: Common ilib package externals (e.g., `log4js`)


## Browser Support

### Browser Detection

The shared configuration automatically detects which browsers are installed on your system and only includes those browsers in the test configuration. This prevents test failures due to missing browser installations.

**Supported Browsers:**
- **Chrome** - Detected via `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (macOS) or `C:\Program Files\Google\Chrome\Application\chrome.exe` (Windows)
- **Firefox** - Detected via `/Applications/Firefox.app/Contents/MacOS/firefox` (macOS) or `C:\Program Files\Mozilla Firefox\firefox.exe` (Windows)
- **Opera** - Detected via `/Applications/Opera.app/Contents/MacOS/Opera` (macOS) or `C:\Program Files\Opera\opera.exe` (Windows)
- **Edge** - Detected via `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` (Windows only)

**Cross-Platform Detection:**
- **macOS**: Checks for browser applications in `/Applications/`
- **Windows**: Checks for browser executables in `Program Files` directories
- **Linux**: Uses `which` command to check if browser is in PATH

Only browsers that are actually installed will be included in the test configuration, ensuring reliable test execution.


### Custom Browser Selection
You can override the default browsers for package-specific needs:

```javascript
// Use only Chrome
browsers: ["ChromeHeadless"]

```


## Default Configuration

The shared configuration provides:

- **Plugins**: karma-webpack, karma-jasmine, karma-chrome-launcher, karma-firefox-launcher, karma-opera-launcher, karma-edge-launcher (Windows), karma-assert
- **Frameworks**: Jasmine, webpack
- **Browsers**: All available browsers for the current platform (default)
- **Custom Launchers**: ChromeHeadless, FirefoxHeadless, OperaHeadless, EdgeHeadless (Windows)
- **Webpack**:
  - Mode: development
  - Target: web
  - Automatic loader configuration based on file types
- **Base Path**: Empty string (current directory)

## Package Dependencies

The shared Karma configuration automatically provides all necessary dependencies. You only need to add `ilib-common-config` to your package:

```json
{
  "devDependencies": {
    "ilib-common-config": "workspace:*"
  }
}
```

All Karma-related dependencies (karma, karma-webpack, browser launchers, loaders, etc.) are automatically available through the shared configuration package.

## Migration from Individual Configs

To migrate from an existing karma configuration:

1. Add `ilib-common-config` as a devDependency as per the previous section
2. Replace the parameter to your `config.set()` call with `createKarmaConfig()`
3. Keep only package-specific settings (files, preprocessors, custom webpack rules)
4. Remove shared configuration (plugins, frameworks, browsers, base webpack config) to just use the standard karma config
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

