# ilib-loctool-tap-i18n

## 1.1.4

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.1.3

### Patch Changes

- d20d079: Fixed plural categories in plugin output to always produce required category `many` for Polish and Russian.
- Updated dependencies [c5ee237]
  - ilib-tools-common@1.14.0

## 1.1.2

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-tools-common@1.12.1
  - ilib-yaml@1.0.2

## 1.1.1

- fixed a problem between using loctool internal resources and ilib-tools-common
  resources. They are almost the same, but not completely, which lead to
  problems in producing localized versions of the tap yaml files.

## 1.1.0

- Added the ability to use the global locale mapping

## 1.0.0

- Initial version
