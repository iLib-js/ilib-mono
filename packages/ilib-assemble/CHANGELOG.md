# ilib-assemble

## 1.3.1

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-common@1.1.5

## 1.3.0

- Removed the `mkdirp` package dependency.
- Add the ability to assemble the legacy version of iLib.  
   When the legacyilib flag is set, it assembles files in the legacy style, which refers to the files from iLib. The generated output includes separate files for JS code and locale data: one JS file containing the JS code and iLib's root locale data, and additional JSON files for
  locale-specific data. Currently, it generates files in the `[language].js` format.  
   The end result is similar to the result of assembling ilib using webpack or rollup, but it is simpler and produces data files as javascript which can be used in other situations without requiring you to use webpack or rollup.  
  e.g

```
 ilib-assemble output-dir --legacyilib --ilibPath ~/Source/develop/ --ilibincPath src/ilib-all-inc.js -l "af-ZA,am-ET,ko-KR"
```

- Add the option `customLocalePath` to override the locale data with custom data.  
  The open-source locale data is based only on the CLDR. If your company wants override certain settings, it can create custom JSON locale data in the same format and the same locale hierarchy as the ilib files, and any data in the custom files will override the parallel data from CLDR.

## 1.2.1

- converted all unit tests from nodeunit to jest

## 1.2.0

- added --resources option to include translated resource files into the
  output bundle
- fixed missing dependencies

## 1.1.2

- work with the hybrid commonjs/ESM modules

## 1.1.1

- Updated dependencies to avoid the polyfill bloat

## 1.1.0

- added the ability to add a nodule to the list of modules to include the locale
  data for. This is often used to include the locale data of the current
  package for testing.
- added the ability to get the list of locales to process from a json file
- locale data in js files now get output as a function that returns the data. That
  way you don't need any babel plugins to process exported const values.
  (ie. you don't need babel-plugin-transform-add-module-exports)
- only resolve paths to modules when they are module references. That is, they are
  not relative to the current dir nor are they absolute paths

## 1.0.0

- initial version
- Code to replace the ilib-webpack-loader and ilib-webpack-plugin by
  performing the same task, but outside of webpack.
