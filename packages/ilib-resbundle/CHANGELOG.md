# ilib-resbundle

## 1.0.4

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.3

### Patch Changes

- 04ca0dc: - Migrate ilib-localeinfo package into the ilib-mono monorepo
  - Link ilib-lint and ilib-resbundle to the workspace version of ilib-localeinfo
- d1a76e8: - Migrate ilib-resbundle package into the ilib-mono monorepo
  - Link ilib-address to the workspace version of ilib-resbundle

## 1.0.2

### Patch Changes

- Migrated package to ilib-mono monorepo
