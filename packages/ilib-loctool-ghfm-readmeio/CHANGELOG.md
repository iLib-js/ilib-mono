# ilib-loctool-ghfm-readmeio

## 1.2.3

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.2.2

### Patch Changes

- ff316a5: Updated message-accumulator and ilib-tree-node to the latest major version.
- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - message-accumulator@3.0.1
