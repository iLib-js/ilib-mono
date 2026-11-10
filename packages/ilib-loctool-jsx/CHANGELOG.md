# ilib-loctool-jsx

## 1.2.4

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.2.3

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-loctool-javascript-resource@1.0.7

## 1.2.2

- update dependencies
- convert all the unit tests from nodeunit to jest

## 1.2.1

- update dependencies
- use the loctool's logger instead of its own
