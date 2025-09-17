# ilib-common-config

A shared configuration package for ilib monorepo packages, providing common testing utilities, E2E testing infrastructure, and shared Karma configurations.

## Overview

This package serves as a central hub for shared testing and configuration utilities used across all ilib packages. It provides:

- **E2E Testing Infrastructure**: Jest configuration and utilities for end-to-end testing
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

## E2E Testing

The package provides comprehensive E2E testing infrastructure for ilib packages. This follows the established pattern used by all ilib packages like `ilib-loctool-ghfm`, `ilib-loctool-po`, and others.

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

3. **Configure Jest** using the shared configuration:
   ```javascript
   // test-e2e/jest.config.cjs
   const { jestConfig: baseConfig } = require('ilib-common-config');

   const config = {
       ...baseConfig,
       displayName: {
           name: "your-package-name e2e",
           color: "blackBright", // or "yellow", "green", etc.
       },
   };

   module.exports = config;
   ```

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

**Available Colors**: `blackBright`, `yellow`, `green`, `blue`, `magenta`, `cyan`, `white`, `red`

### Real-World Examples

Here are examples from actual ilib packages using the shared E2E configuration:

#### ilib-loctool-po
```javascript
// test-e2e/jest.config.cjs
const { jestConfig: baseConfig } = require('ilib-common-config');

const config = {
    ...baseConfig,
    displayName: {
        name: "ilib-loctool-po e2e",
        color: "yellow",
    },
};

module.exports = config;
```

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

### E2E Testing Pattern

All ilib packages follow this standardized E2E testing pattern:

1. **Create test-e2e directory**:
   ```
   test-e2e/
   ├── jest.config.cjs
   └── samples.e2e.test.js
   ```

2. **Configure Jest** using the shared configuration
3. **Use the provided runners** for tool execution
4. **Add package.json script**:
   ```json
   {
     "scripts": {
       "test:e2e": "node node_modules/jest/bin/jest.js --config test-e2e/jest.config.cjs"
     }
   }
   ```

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
    }));
};
```

### Features

- **Automatic Setup**: Shared karma-setup.js is automatically included
- **Environment Detection**: Automatically detects TypeScript vs JavaScript packages
- **Deep Merging**: Package-specific webpack configs merge with base configuration
- **Validation**: Ensures required properties are provided
- **Type Safety**: Full TypeScript support with interfaces

### Documentation

For complete Karma configuration documentation, see [docs/KARMA.md](./docs/KARMA.md).

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