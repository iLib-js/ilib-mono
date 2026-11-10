# ilib-glyphstring

## 1.1.1

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.1.0

### Minor Changes

- 76c0617: - Added GlyphString class from monolithic ilib
  - supports almost the same API as the monolithic ilib supported
    except that this class has a static factory method "create"
    which loads an instance of this class asynchronously in the
    same way that other classes in this monorepo do.

### Patch Changes

- Updated dependencies [704813b]
  - ilib-ctype@1.4.0
