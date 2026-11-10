# ilib-loctool-swift

## 1.1.5

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.1.4

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.

## 1.1.3

- update dependencies
- convert unit tests from nodeunit to jest

## 1.1.2

- update dependencies
- use the loctool's logger instead of its own

## 1.1.1

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.
