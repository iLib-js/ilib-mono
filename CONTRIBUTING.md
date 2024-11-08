# Contributing

## Environment

This project is developed using the following tools:

-   [`nvm`](https://github.com/nvm-sh/nvm) for runtime version management
    -   installation:
    ```bash
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    ```
    or see [guide](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
    -   optional, recommended: add automated `nvm use` to shell profile - see [guide](https://github.com/nvm-sh/nvm?tab=readme-ov-file#zsh)
-   [`NodeJS v20 LTS`](https://nodejs.org/en) runtime
    -   installation:
    ```bash
        nvm install 20
        nvm use # run in repo root to use version specified in .nvmrc
    ```
    or see [guide](https://nodejs.org/en/download/package-manager)
-   [`pnpm v9`](https://pnpm.io/) for package management and package workspaces support
    -   installation:
    ```bash
        corepack enable pnpm # corepack should have been installed automatically during `nvm install`
    ```
    -   or see [guide](https://pnpm.io/installation#using-corepack)
    -   pro tip: `pnpm` might be annoying to type; you can alias it to `pn` instead
        -   example installation:
        ```bash
            echo 'alias pn="pnpm"' >> ~/.bashrc
        ```
        or see [guide](https://pnpm.io/installation#adding-a-permanent-alias-on-posix-systems)
-   [`turborepo`](https://turbo.build/repo/docs) for monorepo task running (caching, parallelization)
    -   turborepo is installed as a dev dependency in the project - use it through package manager
    ```bash
        pnpm turbo <command>
    ```
    -   common commands are aliased in [root `package.json`](./package.json) scripts
    -   optional, not recommended: [global installation docs](https://turbo.build/repo/docs/getting-started/installation#global-installation)

## Adding a package

Currently there is no common package template, as we're moving existing ilib packages into the monorepo without unification (this will be addressed in future).

A new package can be added simply by creating a new directory in the `packages` directory, and adding a `package.json` file there. To plug in to monorepo tasks (as defined in `turbo.json`), package should define the following scripts:

-   `build`
-   `test`
-   `doc`

All of them are optional though.

If the new package depends on another package in the monorepo, this dependency in `packages/<packageName>/package.json` should be defined using the `workspace:` protocol, e.g.:

```json
{
    "dependencies": {
        "ilib-common": "workspace:*"
    }
}
```

PNPM will automatically substitute this protocol wih a proper semver version upon `pnpm publish`. Read more about PNPM workspaces [here](https://pnpm.io/workspaces).

## Versioning and publishing

TODO
