# Contributing

We welcome contributions to the `ilib-mono` project!
Please follow the guidelines defined in this file to contribute and adhere to the existing code style and conventions.
Ensure your code is documented and passes all linting and tests before submitting a pull request.

This repository is a monorepo for the [iLib-js project](https://github.com/iLib-js).
The project status and structure are described in the [README.md](./README.md) file.

## Table of Contents

-   [Getting Started](#getting-started)
-   [Environment](#environment)
-   [Coding Guidelines](#coding-guidelines)
-   [Adding a New Package](#adding-a-new-package)
-   [Running Scripts](#running-scripts)
-   [Debugging Pluggable CLI Applications](#debugging-pluggable-cli-applications)
-   [Code Coverage](#code-coverage)
-   [Documentation](#documentation)
-   [Versioning](#versioning)
-   [Publishing](#publishing)
-   [Reporting Issues](#reporting-issues)
-   [License](#license)

## Getting Started

If you're an internal contributor, follow your internal guidelines.

External contributors can contribute to the project by following these steps:

1. Fork the repository.
2. Clone the forked repository to your local machine.
3. Create a new branch for the feature or bug fix.
4. Make your changes.
5. Commit the changes with a descriptive commit message.
6. Push the changes to your forked repository.
7. Create a pull request to the main repository.

Before contributing, please set up the project on your local machine by following the instructions in the [SETUP.md](./SETUP.md) file.

### Pull Requests

Every pull request should include the following:

-   Documentation in the code (following the JSDoc/TSDoc standard).
-   Tests.
-   A changelog entry.

## Environment

This project uses the following tools:

-   Node.js for running JavaScript code.
-   `pnpm` as the package manager for managing dependencies and supporting workspaces.
-   Turborepo for monorepo task management (caching, parallelization).

Common commands are aliased in the root [`package.json`](./package.json) scripts.

## Coding Guidelines

TBD

## Adding a New Package

### Package Template

Currently, there is no package template as we are migrating existing `iLib-js` packages into the monorepo without unification.
This will be addressed in the future.

### Manual Package Creation

To manually create a new package, follow these steps:

1. Create a new directory under `packages/`.
2. In the new directory, create a `package.json` file.
3. Add the following scripts to the new package's `package.json` file to integrate with monorepo tasks (defined in `turbo.json` in the monorepo root directory):

    - `build`
    - `test`
    - `doc`

    These scripts are optional.

4. If the new package depends on another package in the monorepo, define this dependency using the workspace protocol in the `dependencies` section of your `packages/<packageName>/package.json`, like this:
    ```json
    {
        "dependencies": {
            "ilib-common": "workspace:^"
        }
    }
    ```
    When you run `pnpm publish`, `pnpm` will automatically replace this protocol with the appropriate semver version.
    You can learn more about `pnpm` workspaces [here](https://pnpm.io/workspaces).

## Running Scripts

To run scripts for a single package, execute commands from the package's root directory.

```bash
# cd packages/package-name
pnpm [script-name]
```

### Build

TBD

To build, use:

```bash
pnpm build
```

### Doc

TBD

To generate documentation, use:

```bash
pnpm doc
```

### Lint

TBD

### Test

There are several ways to run tests:

-   For affected package(s) only.
-   For all packages in the monorepo.

#### 1. Run tests for affected package(s)

It is recommended to run tests only for the projects impacted by recent changes, to save time and resources, and to
optimize the testing process by skipping tests for projects that haven't been modified. To do so, simply run:

```bash
pnpm test
```

#### 2. Run tests for all packages

To run tests for all packages in the monorepo, use:

```bash
pnpm test:all
```

#### 3. Other options

These may be useful for development or debugging purposes.
Run these commands from the root directory of the package you're interested in.

1. Run all tests for a single package in the monorepo:

```bash
pnpm --filter package-name test
```

Or `cd` into the package directory and run:

```bash
# cd packages/package-name
pnpm test
```

2. Run tests for a single file by passing the file path as an argument to the `pnpm test` command, like this:

```bash
pnpm --filter loctool test "ResourceConvert.test.js"
```

Or `cd` into the package directory and run:

```bash
# cd packages/package-name
pnpm test "ResourceConvert.test.js"
```

## Debugging Pluggable CLI Applications

This monorepo publishes some CLI applications that support plugins; it also publishes those plugins. For example:

-   [`loctool`](./packages/loctool)
    -   [`ilib-loctool-json`](./packages/ilib-loctool-json)
-   [`ilib-lint`](./packages/ilib-lint)
    -   [`ilib-lint-react`](./packages/ilib-lint-react)

To debug these CLI applications with plugins directly within the monorepo, you can use the environment variable [`NODE_PATH`](https://nodejs.org/api/modules.html#loading-from-the-global-folders).

For example, to debug `loctool` with the `ilib-loctool-json` plugin, you can run:

```bash
# First, ensure all packages in the monorepo are built
pnpm build
# Set NODE_PATH to the monorepo context to allow loading plugins directly from the monorepo
export NODE_PATH=$(pwd)/packages
# Run the app from the monorepo on a project that uses the plugin ilib-loctool-json
node loctool/lib/loctool.js localize ~/ilib-loctool-samples/js-json
```

This allows you to test changes to both the CLI application and the plugin simultaneously without needing to publish or manually link them (e.g., with `yarn link`).

To simplify this process, the monorepo provides `run:*` scripts that set `NODE_PATH` for you. The above example can be simplified to:

```bash
# Build is still required
pnpm build
# Run the app from the monorepo using the script
pnpm run:loctool localize ~/ilib-loctool-samples/js-json
```

These scripts also embed the `--inspect` flag to enable debugging with tools like VSCode's _Auto Attach: With Flag_ feature.

## Code Coverage

Code coverage is configured at the monorepo level in the root `jest.config.js`. Each package that wants to participate in code coverage reporting needs to follow the steps in the [Adding Code Coverage](#adding-code-coverage) section.

### Running Code Coverage

For packages that already use code coverage, it is integrated into the `ilib-mono` GitHub Actions workflow for pull requests. Code coverage is calculated with Jest for selected packages, and the coverage report is automatically added as a comment to each pull request.

The comment contains detailed information about the code coverage for the files changed in a PR, along with information about uncovered lines and direct links to them. Additionally, overall information for each package is also added as a comment to each pull request. This includes details about the percentage of covered lines (statements, branches, and functions) and information about the number of tests (total, skipped, failures, errors) along with their execution time.

A full code coverage report is saved as an artifact and is available for download from the GitHub Actions CI workflow for pull requests.

To run code coverage locally for all packages in the monorepo, run the following command from the root directory:

```bash
pnpm run coverage
```

To run it only for affected package(s), use:

```bash
pnpm run coverage:affected
```

Additionally, code coverage can be run for a single package in the monorepo from the root directory:

```bash
pnpm --filter package-name test
```

Or by navigating to the package directory:

```bash
# cd packages/package-name
pnpm run coverage
```

The `coverage` script in all of these cases produces a `coverage/` directory in the root of the package, as well as `coverage.txt` and `junit.xml` files containing the code coverage details.

### Adding Code Coverage

Each package that wants to participate in code coverage reporting needs to:

1. Have a `jest.config.cjs` file that extends the root configuration:

```javascript
const baseConfig = require("../../jest.config.js");

const config = {
    ...baseConfig,
    displayName: {
        name: "package-name",
        color: "blue", // Choose your color from chalk's palette
    },
    // Package-specific Jest configuration (if needed)
};

module.exports = config;
```

The `color` property uses [chalk's color palette](https://github.com/chalk/chalk#colors).

2. Have a `coverage` script in its `package.json`:

```json
"scripts": {
  // ...
  "coverage": "pnpm test --coverage"
}
```

By following these steps, the package will be included in the code coverage report, and the results will be automatically commented on each pull request to `ilib-mono`.

## Documentation

TBD

## Versioning

TBD

## Publishing

TBD

## Reporting Issues

To report a bug or submit a feature request, please create an issue on the GitHub repository.

## License

By contributing to `ilib-mono`, it is understood and acknowledged that contributions will be licensed under the Apache License.
