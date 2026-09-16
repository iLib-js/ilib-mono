# loctool

A string resource extractor for multiple file types and project types.

This is **loctool 3**, a TypeScript rewrite of the loctool. The sources live in `packages/loctool3` so that loctool 2 (`packages/loctool`) can continue to be developed and published independently.

The CLI is still invoked as `loctool`, and the version starts at 3.0.0. The workspace package is named `loctool3` so that existing `loctool` workspace dependencies keep resolving to version 2. When version 2 is no longer published from this repo, this package can be renamed to `loctool` for npm.

## Status

The package currently contains TypeScript, Jest, and documentation scaffolding only. Commands from loctool 2 have not been ported yet.

## License

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](LICENSE) file.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Development

From the monorepo root:

```
pnpm install
pnpm --filter loctool3 build
pnpm --filter loctool3 test
```
