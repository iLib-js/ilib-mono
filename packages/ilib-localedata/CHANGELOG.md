# ilib-localedata

## 1.5.0

- added the `crossRoots` option to LocaleData.loadData which will
  load all of the data in all of the roots (global and local) and
  merge it all. Normal operation, which is still default, is to use
  the first data found, no matter which root it is in, and ignore
  the data in the other roots.

## 1.4.1

- fixed a bug where getLocaleData was returning the same instance for
  all paths

## 1.4.0

- fixed a bug in data caching when the cache is cleared
- fixed a problem where sync loading is requested but the loader doesn't
  support sync loading. In this case, if the data is not in the cache, it
  now throws an exception. If the data is in the cache, it now returns it
  properly.
- in async mode only, add the ability to load the assembled locale data
  files automatically before any individual files in order to save time.
  If there is an assembled locale data file, it loads one file and then
  returns the data, instead of loading many files and merging the results
  before returning the data.

## 1.3.3

## 1.3.2

- This module is now a hybrid ESM/CommonJS package that works under node
  or webpack
- accidentally bumped the version to v1.3.3 before publishing the changes for
  v1.3.2

## 1.3.1

- fixed a bug where data loaded from webpacked js files was not cached properly

## 1.3.0

- added support for loading files within webpack in a web page
- implemented LocaleData.ensureLocale()
- now depends on updated dependencies like ilib-loader which it now loads as es6 code
  - allows webpack to see the webpack magic comments so that it knows how to bundle the locale data files
- all unit tests now work on node and on browsers with the webpack loader, including the ensureLocale() tests
- can now load data from json files as well as js files

## 1.2.0

- added support for the `mostSpecific` and `returnOne` flags to `loadData`.
  When `mostSpecific` is true, only the most specific locale data is returned.
  When `returnOne` is true, only the least specific locale data is returned.
  When these are false, the locale data is merged with all of the parent locales
  to create superset data.

## 1.1.0

- Add caching support so that data is only loaded once
- Cache the data in the global scope so that it can be shared with
  all instances of LocaleData
- update documentation

## 1.0.0

- Initial version
