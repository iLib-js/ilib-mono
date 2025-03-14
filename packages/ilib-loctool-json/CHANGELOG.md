# ilib-loctool-json

## 1.5.7

### Patch Changes

- d2f3bc4: The `localizable` keyword in the JSON schema has been extended to support multiple string values: `"comment"`, `"key"`, and `"source"` in addition to previously supported boolean values.
  Boolean values are still supported for backward compatibility. `false` is still a default value for the `localizable` keyword.
  Also, for backward compatibility, the `localizable: "source"` keyword is treated as `localizable: true`.

## 1.5.6

### Patch Changes

- 5ec8679: Added missing dependency on micromatch.

## 1.5.5

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.

## 1.5.4

- fixed a bug where array entries without any localizable values in
  them were being coming out as `null` in the localized json files.
- updated dependencies

## 1.5.3

- update dependencies
- convert all unit tests from nodeunit to jest

## 1.5.2

- fixed a bug where the "anyOf", "allOf", "oneOf", and "not" keywords
  in json schemas were not handled properly (or at all!) causing
  the plugin to miss strings that should be localized
- update dependencies

## 1.5.1

- update dependencies

## 1.5.0

- added support for locale maps when generating output path names

## 1.4.0

- added the ability to read json files as translated resource files
  - if the mappings include a template and the path name matches, it
    will use the locale gleaned from the path name when extracting
    resources

## 1.3.0

- added the ability to use this plugin as the output resource file format for other
  plugins
  - added addResource() to the JsonFile
  - changed write so that if there is no existing json, it will generate
    a new json file using hard-coded output templates

## 1.2.5

- Use the logger provided by the loctool instead of trying to log things on our own
- Use the formatPath and getLocaleFromPath functions provided by the loctool instead
  of our own

## 1.2.4

- normalize the path before matching against the mappings so that the matching
  works better

## 1.2.3

- fix issue of the parser that resulted in skipping objects with
  single boolean field which equals `false`

## 1.2.2

- Fix a bug where the pseudo locales were not initialized properly. This fix gets
  the right set of locales from the project settings to see if any of them are pseudo locales.

## 1.2.1

- Fixed bug where it was not generating pseudo localized text properly for missing
  translations when pseudo is turned on

## 1.2.0

- add support for $refs in array schema definitions

## 1.1.1

- few README.md files (this file!)

## 1.1.0

- extended array support:
  1. corrected handling of primitive types. Values are casted to their initial type upon translation
  2. added support for array of objects
- fixed a bug of a copy method that results in json parts, that are not defined in the schema,
  to be removed from localized files

## 1.0.1

- fixed a bug where plural strings resources were not extracted to the new
  strings file properly

## 1.0.0

- initial version
- support json schema and also default schema (key/value pairs)
