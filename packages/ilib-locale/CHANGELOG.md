# ilib-locale

## 1.3.0

### Minor Changes

- c6696b2: Add support for BCP-47 extension subtags and multiple variants:

  - **Extension subtags**: The parser now recognizes extension singletons (`u`, `t`, `x`, etc.) and preserves the entire extension (e.g., `u-co-phonebk`, `t-ja`, `x-pseudo`) as part of the variant.
  - **Multiple variants**: Multiple variant subtags are now concatenated together instead of only keeping the last one (e.g., `nedis-rozaj`).
  - **Combined support**: Variants and extensions can be combined correctly (e.g., `valencia-u-co-trad`).

  This fixes issues where extension subtags like `u-co-phonebk` would corrupt the parsed locale by misinterpreting parts of the extension as language codes.

  Additionally:

  - **Updated ISO 15924 script codes**: Updated from 203 to 226 script codes using data from Unicode 17.0 (via ucd-full package). New scripts include Kawi, Nag Mundari, Garay, Gurung Khema, Kirat Rai, Ol Onal, Sunuwar, Todhri, Tulu-Tigalari, and others.
  - **Added code generation scripts**: Added scripts to auto-generate ISO code files from authoritative npm packages:
    - `scripts/generate-scripts.js` - generates `src/scripts.js` from ucd-full (226 scripts)
    - `scripts/generate-languages.js` - generates `src/a1toa3langmap.js` from @cospired/i18n-iso-languages (184 languages)
    - `scripts/generate-regions.js` - generates `src/a2toa3regmap.js` from iso-3166-1 (249 regions)
    - Run `pnpm generate` to regenerate all code files.

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
