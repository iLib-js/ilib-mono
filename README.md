# ilib-loctool-salesforce-metaxml

Loctool plugin to read Salesforce -meta.xml files and write out translations.

The source file it is looking for is `**/translations/en_US.translation-meta.xml`
which should be generated when you enable translation in the workbench. It writes out
translated files in the same directory with the "en_US" replaced with the name of
the target locale. The dash in the standard BCP-47 locale name is replaced with an
underscore, because that is what Salesforce is expecting to find.

## Release Notes

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

