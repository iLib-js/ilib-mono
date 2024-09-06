# Contributing

## Node version

This package is developed using NodeJS v18 LTS. `@types/node@18` and `@tsconfig/node18` are used to ensure transpiled code compatibility. [`nvm`](https://github.com/nvm-sh/nvm) is recommended for runtime version management.

Package manager used during development is [`yarn classic`](https://classic.yarnpkg.com/lang/en/docs/install/).

## Setup

Install dependencies by running

```sh
yarn install
```

## Linting And Formatting

[`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) run automatically for staged files during pre-commit hook (via [`husky`](https://typicode.github.io/husky/) and [`lint-staged`](https://github.com/lint-staged/lint-staged)). Please, do not use `--no-verify` to skip them.
