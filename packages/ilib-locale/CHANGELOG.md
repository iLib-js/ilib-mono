# ilib-locale

## 1.2.4

### Patch Changes

- 6bf9033: Migrated package into monorepo.

## 1.2.3

- Convert all unit tests from nodeunit to jest
- added ability to run tests on browsers via karma

## 1.2.2

- This module is now a hybrid ESM/CommonJS package that works under node
  or webpack

## 1.2.1

- Removed dependency on polyfills that are not needed, which should make this
  easier to depend upon.

## 1.2.0

- Now ships both the ES6 modules in the src directory and the commonjs code
  (transpiled with babel) in the lib directory. Callers can choose which one
  they would like to use.

## 1.1.1

- Update dependencies and target the right node & browser versions with babel

## 1.1.0

- added the ability to parse locale specs that contain underscores
  instead of dashes. Some locale specs for Java properties file names
  or in some gnu gettext libraries are specified with underscores.
  (ie. "zh_Hans_CN" === "zh-Hans-CN" now)
- updated dependencies

## 1.0.2

- fixed some incorrect unit tests

## 1.0.1

- do not put the module name into the package.json, because it screws
  up the import of ilib-locale in other apps that use webpack
- added API documentation
- added new way of doing web testing using a webpacked version of the tests

## 1.0.0

- Code taken from ilib 14.7.0 and converts to an ES6 module.
- Use Babel to transpile it back to ES5 so it can be used in either ES5 or
  ES6 code
