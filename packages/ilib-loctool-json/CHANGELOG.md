# ilib-loctool-json

## 2.1.0

### Minor Changes

- 13c09b8: - Added support for `resourceFileTypes` configuration to delegate output writing to a
  different plugin. When a `resourceFileTypes` mapping exists for "json" in the project
  configuration, the plugin will use the configured resource file type plugin to write
  localized files instead of writing JSON directly. This allows using plugins like
  `ilib-loctool-javascript-resource` to add custom headers/footers to the output.
  - Allow the plugin to send resources that have a target locale that has a variant to a
    resource file during localization. Previously, locales with variants were ignored.

## 2.0.1

### Patch Changes

- 40eaaea: Fixed behaviour where an empty object in source JSON would get the sparse treatment, even if it was not enabled in config.

## 2.0.0

### Major Changes

- 91d16ff: Fixed absolute schema path resolution. Updated behaviour of relative schema path resolution to be more in-line with project settings convention i.e. resolve it relative to the loctool project's root rather than current working directory (for those rare cases where someone runs loctool outside of a given project).

  Migration guide: [docs/upgrades/ilib-loctool-json/2.0.0.md](docs/upgrades/ilib-loctool-json/2.0.0.md)

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
