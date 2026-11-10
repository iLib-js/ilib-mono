# message-accumulator

## 3.0.3

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 3.0.2

### Patch Changes

- ae2549a: Fixed broken links in package metadata.
- Updated dependencies [ae2549a]
  - ilib-tree-node@2.0.1

## 3.0.1

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.

## 3.0.0

- convert all unit tests from nodeunit to jest
- export the es6 code as real es6 modules and old transpiled javascript
  for older packages to use (breaking change)
