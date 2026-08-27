# ilib-istring

## 1.1.2

### Patch Changes

- 83316c6: - Fix a bug where plurals in some languages were wrong
  - Plurals for Asian languages mistakenly had a singular.
  - Update to CLDR 48.2

## 1.1.1

### Patch Changes

- 09986f9: Fixed missing dependency on regenerator-runtime.
- 6bf9033: Migrated package into monorepo.
- Updated dependencies [6bf9033]
  - ilib-locale@1.2.4

## 1.1.0

- Update to CLDR v44

## 1.0.1

- remove references to import.meta in the transpiled code so that it runs properly when you require() this package

## 1.0.0

- initial version
- copied from ilib 14.9.0
