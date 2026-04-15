# ilib-mono — Agent Instructions

This document provides context for AI agents working on the **ilib-mono** monorepo. It covers project setup, structure, and common workflows. For coding standards and conventions, see `.cursor/rules/`.

## Project Overview

ilib-mono is a monorepo for the [iLib-js project](https://github.com/iLib-js), containing internationalization (i18n) and localization (l10n) libraries and tools. It is managed with **pnpm workspaces** and **Turborepo**.

- **Node.js**: Version in `.nvmrc` (currently Node 22)
- **Package manager**: pnpm (version in root `package.json`)
- **Target**: Node.js >=12.0.0 for published packages

## Prerequisites & Setup

1. **Node.js**: Use `nvm use` to switch to the version in `.nvmrc`
2. **Install dependencies**: `pnpm install` (from repo root; no need to install per package)
3. **Git hooks**: Installed automatically via `postinstall`

See [docs/SETUP.md](docs/SETUP.md) for full setup instructions.

## Project Structure

- `packages/` — All packages live here. Each has its own `package.json`, `README.md`, and is published to npm separately.
- `pnpm-workspace.yaml` — Workspace configuration (includes `packages/*`, `packages/*/samples/*`, `packages/*/test-e2e/__testfiles__/*`)
- `turbo.json` — Turborepo task config (build, test, coverage, test:web, test:e2e)

### Package Categories

| Category | Examples |
|----------|----------|
| Core libraries | `ilib-common`, `ilib-loader`, `ilib-localedata`, `ilib-locale`, `ilib-ctype`, `ilib-istring` |
| Localization tools | `loctool`, `ilib-loctool-json`, `ilib-loctool-javascript`, `ilib-loctool-mdx`, etc. |
| Linting tools | `ilib-lint`, `ilib-lint-react`, `ilib-lint-javascript` |
| Data formats | `ilib-tmx`, `ilib-xliff`, `ilib-po`, `ilib-yaml` |
| Utilities | `ilib-tools-common`, `ilib-env`, `ilib-data-utils` |

## Common Commands

Run from the **repo root** unless noted.

### Build

```bash
pnpm build
```

### Tests

| Command | Description |
|---------|-------------|
| `pnpm test` | Unit tests for **affected** packages only (recommended) |
| `pnpm test:unit:all` | Unit tests for **all** packages |
| `pnpm test:e2e` | E2E tests for affected packages only |
| `pnpm test:e2e:all` | E2E tests for all packages |
| `pnpm test:web` | Web/browser tests for affected packages |
| `pnpm test:web:all` | Web tests for all packages |

### Single Package

```bash
pnpm --filter <package-name> test
# or
cd packages/<package-name> && pnpm test
```

### Coverage

```bash
pnpm coverage              # Affected packages
pnpm coverage:unit:all      # All packages
```

### Documentation

```bash
pnpm doc
```

## Debugging

### Unit tests (per package)

Most packages provide a `debug` script that runs all unit tests under the Node debugger (`--inspect-brk`). Run from the package directory:

```bash
cd packages/<package-name>
pnpm debug
```

Attach a debugger (e.g. VS Code "Auto Attach: With Flag") before the tests start.

### CLI applications (loctool, ilib-lint)

To debug CLI tools with plugins loaded from the monorepo:

```bash
pnpm build   # Build first
pnpm run:loctool localize <path-to-project>   # Debug loctool
pnpm run:lint <args>                           # Debug ilib-lint
```

These scripts set `NODE_PATH=packages` and use `--inspect` for attaching a debugger.

## Key Workflows

1. **Changesets**: For changes that should appear in release notes, run `pnpm changeset add` from the repo root. Select affected packages, choose bump type (patch/minor/major), and add a summary. A new changeset file will be created under `.changeset/` which should be committed.
2. **Internal dependencies**: Use `"ilib-common": "workspace:^"` in `package.json`.
3. **Samples**: `pnpm run:samples` runs sample scripts for affected packages; `pnpm run:samples:affected` for packages affected by changes vs `origin/main`. Samples are often used as part of the end-to-end (e2e) tests.

## Documentation References

- [README.md](README.md) — Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) — Contribution guidelines, PR process, versioning, publishing
- [docs/SETUP.md](docs/SETUP.md) — Setup instructions
- `.cursor/rules/` — Coding standards, package structure, loctool development, etc.
- Each package has its own `README.md` and `CHANGELOG.md`
