# ilib-loctool-properties

## 1.0.6

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.5

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.

## 1.0.4

- update dependencies
- convert unit tests from nodeunit to jest

## 1.0.3

- update dependencies
- use the loctool's logger instead of its own

## 1.0.2

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.

## 1.0.1

- Fixed some broken unit tests and updated some dependencies, but
  otherwise no major code changes
