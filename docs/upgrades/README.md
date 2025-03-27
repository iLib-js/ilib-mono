This directory contains the migration guides for breaking changes of packages in this monorepo.

Each migration guide should be placed in a subdirectory named after the package it is related to, and named after the version it is migrating to. For example, a migration guide for a breaking change in `ilib-loctool-json` package from version `1.0.0` to `2.0.0` should be placed in `docs/upgrades/ilib-loctool-json/2.0.0.md`.

The migration guide should contain a markdown document with the following structure:

```markdown
# `package-name`

## Migration from `from-version` to `to-version`

### Breaking change title

Breaking change description
Migration guide

### Another breaking change title

Breaking change description
Migration guide
```
