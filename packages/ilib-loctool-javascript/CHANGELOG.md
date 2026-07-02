# ilib-loctool-javascript

## 1.2.0

### Minor Changes

- e079b44: - Support new outputSourceLocale flag in the settings
  - Meant to support languages/i18n libraries where
    strings are extracted from the source code directly
    and there is no source locale resource file
  - For the javascript and json plugins, this causes
    the plugin to write out the source locale along
    with the other locales if it is configured in the
    the locales list
  - For the javascript resources plugin, it means that
    it will write out the source string instead of the
    target string for source locale Resource instances

### Patch Changes

- Updated dependencies [e079b44]
  - ilib-loctool-javascript-resource@1.3.0

## 1.1.5

### Patch Changes

- 5ec8679: Added missing dependency on micromatch.

## 1.1.4

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.
- Updated dependencies [ff316a5]
  - ilib-loctool-javascript-resource@1.0.7

## 1.1.3

- update dependencies
- convert all unit tests from nodeunit to jest

## 1.1.2

- update dependencies

## 1.1.1

- deal with eslint's propensity of putting extra commas at the end of parameter lists
  where they shouldn't be. This causes single-parameter strings not to be extracted.

## 1.1.0

- added the ability to use ilib-loctool-json as a resource file
- added the ability to specify output file mappings and
  output file name templates, similar to the other loctool plugins
- updated dependencies
- can now specify a regular expression to match the function wrapper of
  strings
- Use the logger provided by the loctool instead of using log4js directly (which doesn't
  work well)
- minimum version of node is now v10

## 1.0.4

- Updated dependencies to avoid security problems

## 1.0.3

- Fixed so that JavaScriptFileType.write passes the right name when asking for the resource
  file type for javascript files.

## 1.0.2

- Fixed so that JavaScriptFileType passes the right props to
  the JavaScriptFile constructor.
