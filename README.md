# ilib-loctool-salesforce-metaxml

Loctool plugin to read Salesforce -meta.xml files and write out translations.

The source file it is looking for is `**/translations/en_US.translation-meta.xml`
which should be generated when you enable translation in the workbench. It writes out
translated files in the same directory with the "en_US" replaced with the name of
the target locale. The dash in the standard BCP-47 locale name is replaced with an
underscore, because that is what Salesforce is expecting to find.

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.1.0

- now uses ilib-loctool-xml plugin to parse various meta xml files to look for
  source strings

### v1.0.5

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.

### 1.0.4

- Apparently in Salesforce Portuguese has no default. This fix makes sure that
  both pt-PT and pt-BR are fully specified with neither of them being the default
  for "pt" by itself

### 1.0.3

- Fixed a problem with nb-NO and es-419 which Salesforce do not support
    - mapped to "no" and "es-MX" respectively

### 1.0.2

- add the sflocales.json config file to the package

### 1.0.1

- Fixed a problem in the package.json where it was pointing to the wrong main file name
- Fixed a problem where it was not handling the resource types properly
    - previously, it used the "flavor" concept to differentiate between types,
      but a flavor is associated with a whole file, not individual strings
    - now uses a "context" which is associated with individual strings

### 1.0.0

- Initial version
- Added support for classes, fields, and objects
- writes out translation meta xml files

