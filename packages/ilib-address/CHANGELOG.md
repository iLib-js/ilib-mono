# ilib-address

## 1.0.4

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.3

### Patch Changes

- d1a76e8: - Migrate ilib-resbundle package into the ilib-mono monorepo
  - Link ilib-address to the workspace version of ilib-resbundle

## 1.0.2

### Patch Changes

- 6bf9033: Migrated package into monorepo.
- Updated dependencies [09986f9]
- Updated dependencies [6bf9033]
  - ilib-istring@1.1.1
  - ilib-locale@1.2.4
  - ilib-ctype@1.2.2

## 1.0.1

- Updated dependencies
- Published the locale data in the npm package that was missing in the
  initial release. (whoops!)

## 1.0.0

- Initial version copied from ilib 14.15.2
