# tmxtool

## 1.0.5

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.4

### Patch Changes

- f9f1095: Unified package entrypoint definitions. This should help resolve edge cases where older packages (like Jest 26) were unable to correctly load some of them.
- ae2549a: Fixed broken links in package metadata.
- Updated dependencies [ae2549a]
  - ilib-tmx@1.1.5

## 1.0.3

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-tmx@1.1.4

## 1.0.2

- converted all unit tests from nodeunit to jest
- updated dependencies

## 1.0.1

- fixed a bug where the -o outputfile option did not work properly

## 1.0.0

- initial release relying on ilib-tmx for tmx related functionality
