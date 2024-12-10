# ilib-loctool-csv

## 1.2.4

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.

## 1.2.3

- update dependencies
- convert unit tests from nodeunit to jest

## 1.2.2

- update dependencies
- use the loctool's logger instead of its own

## 1.2.1

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.

## 1.2.0

- previous versions did not package the js files, which made them useless!
- added content to this README.md
- added support for mappings
- added support for extracting resources from csvs
- added support for configuring columns
- added support for optional header row

## 1.1.0

- add localization support

## 1.0.0

- initial version
- support reading csvs but not writing them
