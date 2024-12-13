# ilib-loctool-xml

## 1.1.5

### Patch Changes

- 5ec8679: Added missing dependency on micromatch.

## 1.1.4

### Patch Changes

- ff316a5: Linked dependencies within the monorepo.

## 1.1.2

- update dependencies
- use the loctool's logger instead of its own

## 1.1.1

- Add unit tests to verify parsing the file name with locale
- Updated the way that the plugin decides which files to handle

## 1.1.0

- Add support for new replacements and tags
  - In parsing the resources, you can now extracted the
    "formatted", "context", and the "flavor" attributes for a resource.
  - In creating a plural template, you can now use those three
    attributes.
  - When getting the value of an attribute, you can now use the
    \_pathname and \_basename values, which will convert into the full
    path name of the file, and the base name of the file.
- Make sure required properties exist in the localization
  - If a property is required, it should exist in the localized
    file, even if it does not exist in the source file. This
    allows for localization of empty strings or missing source
    strings.
- fixed android resource schema file which was missing from the package
- added localeMap to the configuration of a mapping

## 1.0.0

- initial version
- support JSON schema style parsing of XML and also a default schema
  (Java properties files)
- support for plural templates
