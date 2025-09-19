# ilib-common-config

A shared configuration package for ilib monorepo packages, providing common testing utilities, E2E testing infrastructure, and shared Karma configurations.

## Overview

This package serves as a central hub for shared testing and configuration utilities used across all ilib packages. It provides:

- **Jest Configurations**: Shared Jest setups for CommonJS/ES5, ESM, TypeScript, and E2E testing
- **TypeScript Configuration**: Shared TypeScript compilation settings
- **E2E Testing Infrastructure**: Utilities and runners for end-to-end testing
- **Shared Karma Configuration**: Unified browser testing setup for all packages
- **Testing Utilities**: Common test runners and assertion helpers
- **Consistent Configuration**: Standardized testing patterns across the monorepo

## Installation

Since this is a workspace-only package, add it as a devDependency in your package:

```json
{
  "devDependencies": {
    "ilib-common-config": "workspace:*"
  }
}
```

## Jest Configuration

The package provides shared Jest configurations for different types of ilib packages, ensuring consistent testing setup across the monorepo.
For most packages, you only need to define the "displayName" property with the "name" and "color" properties inside of that. The base
jest configuration will typically take care of the rest.

### For CommonJS/ES5 Packages

Most ilib packages use CommonJS with ES5-style code. Use this configuration:

> **⚠️ Important**: For CommonJS/ES5 packages, you must use **Jest v26 or earlier** because Jest v27+ was rewritten in ESM and is incompatible with CommonJS packages.

```javascript
// jest.config.js
var jestConfig = require('ilib-common-config').jestConfig;

var config = Object.assign({}, jestConfig, {
    displayName: {
        name: "your-package-name",
        color: "blueBright", // Choose from available colors
    }
    // Add any package-specific Jest overrides here
});

module.exports = config;
```

### For ESM Packages

Modern packages using ES modules should use this configuration:

> **✅ Compatible**: ESM packages can use the **latest version of Jest** (v27+).

```javascript
// jest.config.js
import { jestEsmConfig } from 'ilib-common-config';

const config = {
    ...jestEsmConfig,
    displayName: {
        name: "your-package-name",
        color: "green",
    },
    // Add any package-specific Jest overrides here
};

export default config;
```

### For TypeScript Packages

TypeScript packages should use this configuration:

> **✅ Compatible**: TypeScript packages can use the **latest version of Jest** (v27+).

```javascript
// jest.config.js
import { tsJestConfig } from 'ilib-common-config';

const config = {
    ...tsJestConfig,
    displayName: {
        name: "your-package-name",
        color: "cyan",
    },
    // Add any package-specific Jest overrides here
};

export default config;
```

### For E2E Testing

E2E tests use a specialized Jest configuration:

> **✅ Compatible**: E2E tests can use the **latest version of Jest** (v27+) since they typically run in a modern environment.

```javascript
// test-e2e/jest.config.cjs
const { jestE2eConfig } = require('ilib-common-config');

const config = {
    ...jestE2eConfig,
    displayName: {
        name: "your-package-name e2e",
        color: "blackBright", // or "yellow", "green", etc.
    },
};

module.exports = config;
```

### Available Colors

Choose from these predefined colors for your package's display name:
- `blackBright`, `blueBright`, `green`, `cyan`, `black`, `magentaBright`, `blue`, `yellow`, `red`, `white`

The idea is that when we run all of the tests in the CI, we want to have a full variety of colors so that it
is easy to see which output comes from which package.

### Common Overrides

If you need some settings that differ from the base jest configuration, you can override them in your configuration. For a complete list of available Jest configuration options, see the [Jest Configuration Documentation](https://jestjs.io/docs/configuration).


## E2E Testing

The package provides comprehensive E2E testing infrastructure for ilib packages. This follows the established pattern used by all ilib packages like `ilib-loctool-ghfm`, `ilib-loctool-po`, and others.

> **Note**: For Jest configuration for E2E tests, see the [Jest Configuration](#jest-configuration) section above.

### Quick Setup

1. **Add dependency** to your `package.json`:
   ```json
   {
     "devDependencies": {
       "ilib-common-config": "workspace:*"
     }
   }
   ```

2. **Create test-e2e directory structure**:
   ```
   test-e2e/
   ├── jest.config.cjs
   └── samples.e2e.test.js
   ```

All of your e2e test files should have the suffix `.e2e.test.js`

3. **Configure Jest** using the shared E2E configuration (see [Jest Configuration](#jest-configuration) section above for details):
   ```javascript
   // test-e2e/jest.config.cjs
   const { jestE2eConfig } = require('ilib-common-config');

   const config = {
       ...jestE2eConfig,
       displayName: {
           name: "your-package-name e2e",
           color: "blackBright", // or "yellow", "green", etc.
       },
   };

   module.exports = config;
   ```

Typically, you only need to define the displayName.name and displayName.color properties just like a regular jest config.

4. **Add test script** to your `package.json`:
   ```json
   {
     "scripts": {
       "test:e2e": "node node_modules/jest/bin/jest.js --config test-e2e/jest.config.cjs"
     }
   }
   ```

### Jest E2E Configuration Details

The shared Jest configuration provides:

- **Test Pattern**: Automatically finds files matching `**/*.e2e.test.?(c|m)(j|t)s`
- **Base Configuration**: Consistent Jest settings across all packages
- **Customizable Display Name**: Each package can set its own name and color


### E2E Test Utilities

The package provides several utilities for E2E testing:

#### LoctoolRunner

Run loctool commands in your E2E tests:

```javascript
const { LoctoolRunner } = require('ilib-common-config');

describe("samples", () => {
    const projectPath = path.resolve(__dirname, "..", "samples", "your-sample");

    beforeAll(async () => {
        const loctool = new LoctoolRunner(projectPath);
        await loctool.run("localize");
    });

    test("that it produces expected output", () => {
        // Your assertions here
    });
});
```

#### LintRunner

Run ilib-lint commands in your E2E tests:

```javascript
const { LintRunner } = require('ilib-common-config');

describe("linting", () => {
    const projectPath = path.resolve(__dirname, "..", "samples", "your-sample");

    beforeAll(async () => {
        const linter = new LintRunner(projectPath);
        await linter.run();
    });

    test("that is passes linting", () => {
        // Your assertions here
    });
});
```

#### expectFileToMatchSnapshot

Compare files against snapshots in E2E tests:

```javascript
const { expectFileToMatchSnapshot } = require('ilib-common-config');

it("should produce expected output file", () => {
    const outputPath = path.resolve(projectPath, "output.xliff");
    expectFileToMatchSnapshot(outputPath);
});
```


## TypeScript Configuration

The package provides shared TypeScript configurations for consistent compilation and testing across all ilib packages.

### Shared TypeScript Base Configuration

Use the shared base TypeScript configuration by extending it in your `tsconfig.json`:

```json
{
    "extends": "../ilib-common-config/tsconfig.base.json",
    "compilerOptions": {
        "outDir": "./lib",
        "rootDir": "./src"
    },
    "include": [
        "src/**/*"
    ],
    "exclude": [
        "node_modules",
        "lib",
        "test"
    ]
}
```

Many projects will not require anything beyond what the base provides, but the ability to extend it is there for
flexibility, just in case. For a complete list of available TypeScript configuration options, see the [TypeScript Configuration Documentation](https://www.typescriptlang.org/tsconfig).

> **Note**: For Jest configuration for TypeScript packages, see the [Jest Configuration](#jest-configuration) section above.

## Karma Configuration

The package provides a shared Karma configuration for browser testing. This ensures consistent testing setup across all packages while allowing package-specific customizations.

### Quick Start

```javascript
// karma.conf.js
const { createKarmaConfig } = require('ilib-common-config');

module.exports = function (config) {
    config.set(createKarmaConfig({
        files: ["./test/**/*.test.js"],
        preprocessors: { "./test/**/*.test.js": ["webpack"] }
        // if necessary, package-specific configuration goes here
    }));
};
```

### Documentation

For complete Karma configuration documentation, including browser detection, webpack settings, and advanced usage, see [docs/KARMA.md](./docs/KARMA.md).

## API Reference

### Exports

- `createKarmaConfig(options)` - Creates a shared Karma configuration
- `createKarmaConfigFunction(options)` - Helper for karma.conf.js files
- `jestConfig` - Shared Jest configuration for E2E tests
- `LoctoolRunner` - Utility for running loctool commands in tests
- `LintRunner` - Utility for running ilib-lint commands in tests
- `expectFileToMatchSnapshot(filePath)` - File snapshot assertion utility

### TypeScript Support

The package provides full TypeScript support with proper interfaces:

```typescript
import { createKarmaConfig, SharedKarmaConfigOptions } from 'ilib-common-config';

const options: SharedKarmaConfigOptions = {
    files: ["./test/**/*.test.ts"],
    preprocessors: { "./test/**/*.test.ts": ["webpack"] },
    type: "typescript"
};
```

## Contributing

This package is designed to be extended as the ilib monorepo grows. When adding new shared utilities:

1. Add TypeScript interfaces for type safety
2. Include comprehensive JSDoc comments
3. Update this README with usage examples
4. Ensure backward compatibility

## License

Copyright © 2025 JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.