# Contributing
We welcome contributions to the ilib-mono project!
Please follow guidelines defined in this file to contribute, follow the existing code style and conventions.
Ensure your code is documented and passes all linting and tests before submitting a pull request.

This repository is a monorepo for the [iLib-js project](https://github.com/iLib-js).
Project status and project structure are described in the [README.md](./README.md) file.


## Table of Contents
- [Getting Started](#getting-started)
- [Environment](#environment)
- [Coding Guidelines](#coding-guidelines)
- [Adding a New Package](#adding-a-new-package)
- [Running scripts](#running-scripts)
- [Documentation](#documentation)
- [Versioning](#versioning)
- [Publishing](#publishing)
- [Reporting Issues](#reporting-issues)
- [License](#license)


## Getting Started
1. Fork the repository.
2. Clone the forked repository to the local machine.
3. Create a new branch for the feature or bugfix.
4. Make your changes.
5. Commit changes with a descriptive commit message.
6. Push changes to the forked repository.
7. Create a pull request to the main repository.

Before contributing, please set up the project on the local machine by following the instructions in the [SETUP.md](./SETUP.md) file.

## Environment
This project is developed using the following tools:
- Node.js for running JavaScript code.
- pnpm  package manager for package management and package workspaces support.
- Turborepo for monorepo task running (caching, parallelization).

Common commands are aliased in [root `package.json`](./package.json) scripts.

## Coding Guidelines
TBD

## Adding a New Package
TBD

Currently, there is no package template as we are moving existing `iLib-js` packages into the monorepo without unification.
This will be addressed in the future.
To manually create a new package, follow these steps:

1. Create a new directory under `packages/`.
2. In the new directory, create a `package.json` file.
3. Add the following scripts to the new package's `package.json` file to plug into monorepo tasks (defined in `turbo.json` in the monorepo root directory):
    -   `build`
    -   `test`
    -   `doc`

    These scripts are optional.
4. If the new package depends on another package in the monorepo, define this dependency using the workspace protocol in the `dependencies` section of your `packages/<packageName>/package.json`, like this:
    ```json
    {
        "dependencies": {
            "ilib-common": "workspace:*"
        }
    }
    ```
    When you run `pnpm publish`, pnpm will automatically substitute this protocol with a proper semver version.
    You can learn more about pnpm workspaces [here](https://pnpm.io/workspaces).


## Running Scripts
To run scripts for a single package run commands from the package root directory.
### Build
TBD

To run the build, use:
```bash
pnpm build
```

### Doc
TBD

To run the doc, use:
```bash
pnpm doc
```

### Lint
TBD

### Test
TDB

To run the tests, use:
```bash
pnpm test
```


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
