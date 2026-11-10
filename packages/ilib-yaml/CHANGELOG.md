# ilib-yaml

## 1.0.4

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.3

### Patch Changes

- ae2549a: Fixed broken links in package metadata.
- Updated dependencies [f9f1095]
- Updated dependencies [ae2549a]
  - ilib-tools-common@1.12.2

## 1.0.2

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-tools-common@1.12.1

## 1.0.1

- upgraded dependencies to avoid a dependabot problem

## 1.0.0

- extracted code from the loctool plugin ilib-loctool-yaml and made a separate
  library out of it so that it can be shared
