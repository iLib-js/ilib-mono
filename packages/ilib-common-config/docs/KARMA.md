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

### TypeScript Package Usage

For TypeScript packages, the configuration automatically detects `.ts` files and configures appropriate loaders:

```javascript
const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        // TypeScript files are auto-detected
        // Note: shared karma-setup.js is automatically included
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
- **Babel configuration**: Comprehensive preset with Node.js and browser targets
- **Externals**: Common ilib package externals (e.g., `log4js`)

## Webpack Configuration

The shared configuration includes a comprehensive webpack setup that handles both TypeScript and JavaScript files:

**Default Webpack Settings:**
- **Mode**: `development`
- **Target**: `web`
- **Externals**: `{ "log4js": "log4js" }` (common across ilib packages)
- **Babel Configuration**:
  - `minified: false`
  - `compact: false`
  - `@babel/preset-env` with Node.js and browser targets
  - `add-module-exports` plugin for CommonJS compatibility

**Automatic Loader Detection:**
- **TypeScript files** (`.ts`): Uses `ts-loader` with `transpileOnly: true`
- **JavaScript files** (`.js`): Uses `babel-loader` with comprehensive preset configuration

**Package-Specific Overrides:**
You can override any webpack setting by providing a `webpack` property in your configuration. The shared configuration uses a custom deep merge function to combine settings with your package-specific overrides.

```javascript
// Example: Adding package-specific webpack configuration
const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        files: ["./test/**/*.test.js"],
        preprocessors: { "./test/**/*.test.js": ["webpack"] },

        // Package-specific webpack overrides
        webpack: {
            resolve: {
                alias: {
                    "custom-module": "./test/mock-module"
                }
            }
        }
    }));
};
```

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

### Supported Browsers

The shared configuration automatically detects your operating system and includes appropriate browsers:

#### Cross-Platform Browsers (All OS)
- **Chrome** (with ChromeHeadless custom launcher)
- **Firefox** (with FirefoxHeadless custom launcher)
- **Opera** (with OperaHeadless custom launcher)

#### Platform-Specific Browsers (Auto-detected)
- **Edge** (with EdgeHeadless custom launcher) - Windows only

The configuration automatically includes platform-specific browsers when available, ensuring optimal browser coverage while maintaining CI compatibility.

### Default Browsers
By default, tests run in all available browsers for your platform:

- **Windows**: ChromeHeadless, FirefoxHeadless, OperaHeadless, EdgeHeadless
- **macOS**: ChromeHeadless, FirefoxHeadless, OperaHeadless
- **Linux**: ChromeHeadless, FirefoxHeadless, OperaHeadless

The configuration automatically detects your platform and includes all available browsers.

### Custom Browser Selection
You can override the default browsers for package-specific needs:

```javascript
// Use only Chrome
browsers: ["ChromeHeadless"]

// Use all available browsers (includes platform-specific ones)
browsers: ["ChromeHeadless", "FirefoxHeadless", "OperaHeadless", "SafariHeadless", "EdgeHeadless"]

// Use specific browsers
browsers: ["Chrome", "Firefox", "Opera", "Safari", "Edge"]  // Non-headless versions
```

### Cross-Platform Considerations

#### Automatic OS Detection
The configuration automatically detects your operating system and includes appropriate browsers:

- **Windows** - Chrome, Firefox, Opera, Edge
- **macOS** - Chrome, Firefox, Opera, Safari
- **Linux** - Chrome, Firefox, Opera

#### CI Compatibility
- **Cross-platform browsers** (Chrome, Firefox, Opera) work on all CI platforms
- **Platform-specific browsers** (Safari, Edge) are automatically excluded on incompatible platforms
- **Graceful degradation** - Missing browsers are automatically skipped

The configuration automatically handles missing browsers gracefully - if a browser isn't installed, Karma will skip it and continue with available browsers.

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

Make sure your package has the required dependencies:

```json
{
  "devDependencies": {
    "ilib-common-config": "workspace:*",
    "karma": "^6.4.0",
    "karma-webpack": "^5.0.0",
    "karma-chrome-launcher": "^3.2.0",
    "karma-firefox-launcher": "^2.1.3",
    "karma-opera-launcher": "^1.0.0",
    "karma-safari-launcher": "^1.0.0",
    "karma-edge-launcher": "^0.4.2",
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
