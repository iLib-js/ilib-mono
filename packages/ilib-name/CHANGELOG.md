# ilib-name

## 1.0.2

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.1

### Patch Changes

- 0bddb9d: Migrate ilib-name package into the ilib-mono monorepo
- Updated dependencies [704813b]
  - ilib-ctype@1.4.0

## 1.0.0

- Initial version copied from ilib 14.15.0
  - converted to ES modules
  - Added Name.create() factory method for asynch operation
