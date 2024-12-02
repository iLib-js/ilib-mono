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
