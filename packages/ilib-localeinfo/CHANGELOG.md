## Release Notes

### v1.1.0

* Updated to CLDR v44.0.0

### v1.0.5

* Fixed Taiwan info when the locale spec is "zh-TW" instead of "zh-Hant-TW".
  Was returning the wrong info previously.

### v1.0.4

* use a babel plugin to remove import.meta from the transpiled code for
  node < v10. Previously, this prevented this package from running properly
  on node v10

### v1.0.3

* converted a static initializer into just regular const value that is
  not exported. That way, this module can run on node < v16.11.0 properly.

### v1.0.2

* Did not export the assemble.mjs file so it was not possible to assemble
  the locale data
* Remove the incorrect check for synchronous loading of data that is already
  in the cache. The check is now in ilib-localedata instead.
* Updated dependencies

### v1.0.1

* This module is now a hybrid ESM/CommonJS package that works under node
  or webpack

### v1.0.0

- Initial version
