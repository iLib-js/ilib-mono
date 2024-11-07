# ilib-loctool-salesforce-metaxml

Loctool plugin to read Salesforce -meta.xml files and write out translations.

The source file it is looking for is `**/translations/en_US.translation-meta.xml`
which should be generated when you enable translation in the workbench. It writes out
translated files in the same directory with the "en_US" replaced with the name of
the target locale. The dash in the standard BCP-47 locale name is replaced with an
underscore, because that is what Salesforce is expecting to find.

This plugin will also read other meta xml files in the project to find source strings
that may be missing in the translation-meta.xml file. The following meta xml file
types are read:

* app-meta.xml
* customPermission-meta.xml
* listView-meta.xml
* field-meta.xml
* labels-meta.xml
* md-meta.xml
* object-meta.xml
* permissionset-meta.xml
* quickAction-meta.xml
* tab-meta.xml

All strings gleaned from those files are used to augment the strings found in the
translations-meta.xml file with a source string.

## Configuration

The plugin will look for the `xml` property within the `settings`
of your `project.json` file. The following settings are
used within the json property:

- schemas: a string naming a directory full of JSON schema files, or
  an array of strings naming some JSON schema files or directories to
  load. If the XML file
  does not fit any of the schema (ie. it does not validate according to
  any one of the schema), then that file will be skipped and not localized.
  Schemas files are discussed below.
- resourceFile: a path name template specifying where the translation-meta.xml
  for this salesforce app lives. Default is:
  "force-app/main/default/translations/[localeUnder].translation-meta.xml"
- mappings: a mapping between file matchers and an object that gives
  info used to localize the files that match it. This allows different
  meta xml files within the project to be processed with different schema.
  This is mainly for meta xml file types that are not the standard ones
  mentioned above.
  The matchers are
  a [micromatch-style string](https://www.npmjs.com/package/micromatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of that mapping is an object that
  can contain the following properties:
    - schema: schema to use with that matcher. The schema is
      specified using the `$id` of one of the schemas loaded in the
      `schemas` property above. The default schema is "properties-schema"
      which is given in the previous section.

Example configuration:

```json
    "settings": {
        "metaxml": {
            "schemas": "./xml/schemas",
            "resourceFile": "force-app/main/foo/translations/[localeUnder].translation-meta.xml",
            "mappings": {
                "**/*.page-meta.xml": {
                    "schema": "my-page-meta-schema"
                }
            }
        }
    }
```

In the above example, any file named `*.page-meta.xml` will be parsed with the
`my-page-meta-schema` schema found in the `xml/schemas` directory. (See the
documentation of the (ilib-loctool-xml)[https://github.com/iLib-js/ilib-loctool-xml/blob/main/README.md]
plugin for details on that.) The
resources from that file will go to augment the source strings of the strings
found in the resource file translation meta xml.

The resource file will be written out to a file named
`force-app/main/foo/translations/[localeUnder].translation-meta.xml`.

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.1.3

- update dependencies
- convert all unit tests from nodeunit to jest

### v1.1.2

- update dependencies

### v1.1.1

- fixed a bug where the xml schemas are not loaded properly on some versions
  of nodejs
- fixed a bug where source strings from various meta xml files cannot be added
  to a translation source file for the locale en-US

### v1.1.0

- now uses ilib-loctool-xml plugin to parse various meta xml files to look for
  source strings. These types are parsed automatically and their schema is
  built-in to this plugin already.
- added the ability to specify a resource file for output of the translations
- added the ability to do mappings to read other types of meta xml that
  are not the standard ones listed above
- updated dependencies

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

