## Release Notes

### v1.1.4 (unreleased)

* convert all unit tests from nodeunit to jest
* add the ability to run web tests in headless chrome

### v1.1.3

* Make Utils.getSublocales work the same way it did under ilib so that
  variant locales are loaded properly.

### v1.1.2

* This module is now a hybrid ESM/CommonJS package that works under node
  or webpack

### v1.1.1

* Removed dependency on polyfills that are not needed, which should make this
  easier to depend upon.

### v1.1.0

* Now ships both the ES6 modules in the src directory and the commonjs code
  (transpiled with babel) in the lib directory. Callers can choose which one
  they would like to use.

### v1.0.3

* updated dependencies
* make sure to target node 10 and older browser when running babel and adding
  polyfills

### v1.0.2

* updated dependencies
* updated docs
* add log4js library support

### v1.0.1

- API documentation updates
- now can test on web browsers easily
- fixed bug in `MathUtils.significant()` where it was calling functions
  using the "MathUtils" namespace instead of local functions
- fixed tests for hash codes to work inside of a webpacked test

### v1.0.0

- initial version
- copied from ilib 14.7.0
