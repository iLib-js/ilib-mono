# ilib-env

## 1.4.1

### Patch Changes

- ae2549a: Fixed broken links in package metadata.

## 1.4.0

- Update to detect webOS platform with webOSSystem value.

## 1.3.3

- Fixed a problem where platform detection would happen every time it was
  called instead of using the cached value of the platform.
- converted all tests from nodeunit to jest
- updated dependencies
- added the ability to test on headless browsers from the command-line

## 1.3.2

- This module is now a hybrid ESM/CommonJS package that works under node
  or webpack

## 1.3.1

- Removed dependency on polyfills that are not needed, which should make this
  easier to depend upon.

## 1.3.0

- Now ships both the ES6 modules in the src directory and the commonjs code
  (transpiled with babel) in the lib directory. Callers can choose which one
  they would like to use.

## 1.2.1

- Updated to use polyfills with babel for node 10 and for older browsers
- Updated dependencies

## 1.2.0

- Added `setLocale` and `setTimeZone` functions. These override the values
  that are gleaned from the platform. To reset them and get the values from
  the platform again, call the functions again with no arguments before calling
  the getters.

## 1.1.0

- When two different copies of ilib-env are loaded from different node_modules
  directories or an app loads two copies of ilib-env with different version
  numbers, they will be copies of each other with separate variables in
  them. When that happens, setting
  the platform, timezone, or locale for the entire app will not work because
  each copy of ilib-env will have a different idea of what those variables are.
  The solution is to save the settings in the global scope so that they are
  shared between all copies of ilib-env.
- update dependencies

## 1.0.2

- Fixed a bug where locales from the platform returned by getLocale() were not
  recognized properly if any of the following apply:
  - They have underscores in them
  - They have a 3 letter language name ("yue" means "Cantonese" for example)
  - They have a three digit UN.49 region name ("001" is the "The World",
    for example)
  - They have a variant on them ("zh-Hant-TW-u-PostOffice" should return the
    basic locale "zh-Hant-TW" as the platform locale)

## 1.0.1

- fixed some lint problems
- added API documentation
- now can test on web browsers automatically
- Fixed various bugs parsing the platform locales in getLocale()
  - Locales with a script code such as "zh-Hans-CN"
  - The posix "C" default locale
  - Platforms where the region code is not upper-case
  - Platforms that don't use a dash to separate the components
  - Platforms that include a dot and a charset name after the specifier

## 1.0.0

- Initial version
