# ilib-lint-python-gnu

## 2.0.3

### Patch Changes

- f9f1095: Unified package entrypoint definitions. This should help resolve edge cases where older packages (like Jest 26) were unable to correctly load some of them.
- Updated dependencies [f9f1095]
- Updated dependencies [ae2549a]
  - ilib-tools-common@1.12.2
  - ilib-lint-common@3.1.2

## 2.0.2

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-tools-common@1.12.1
  - ilib-lint-common@3.1.1
  - ilib-loctool-po@1.6.4

## 2.0.1

- Fixed a bug where the exports were not properly set up in the package.json

## 2.0.0

- Updated dependency from i18nlint-common to ilib-lint-common
  - IntermediateRepresentation now takes a SourceFile as an
    parameter to the constructor instead of a file path
  - can now be loaded by ilib-lint >= v2

## 1.2.0

- updated dependencies, including updating to i18nlint-common 2.x
- parser now returns an array of IntermediateRepresentation objects

## 1.1.0

- updated dependencies
- added getType() method to the POParser plugin
- now return the results of parsing from the POParser.parse() method

## 1.0.0

- initial version
- PO parser for gnu .po and .pot files
- Python rules for gnu gettext resources
