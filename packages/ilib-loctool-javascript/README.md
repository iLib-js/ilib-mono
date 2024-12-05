# ilib-loctool-javascript

ilib-loctool-javascript is a plugin for the loctool that
allows it to read and localize javascript files.

## Configuring the Plugin

### Standard Settings

To use this plugin, you should set these two settings:

- The `projectType` setting should be set to `custom`
- The `resourceFileTypes` setting should be set to an object that
  includes the `javascript` property. The value names the plugin
  that will be used as a resource file format.

### Custom Settings

The plugin will look for the `javascript` property within the `settings`
of your `project.json` file. The following settings are
used within the json property:

- wrapper: specify a regular expression that matches the wrapper function
  that contains strings to extract and unique ids
- mappings: a mapping between file matchers and an object that gives
  info used to localize the files that match it. This allows different
  json files within the project to be processed with different schema.
  The matchers are
  a [micromatch-style string](https://www.npmjs.com/package/micromatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of that mapping is an object that
  can contain the following properties:
    - schema: schema to use with that matcher. The schema is
      specified using the `$id` of one of the schemas loaded in the
      `schemas` property above. The default schema is "strings-schema"
      which is given in the previous section.
    - method: one of "copy" or "sparse"
        - copy: make a copy of the source file and localize the
          string contents. (This is the default method if not specified
          explicitly.)
        - sparse: make a copy of the source file but only
          include localized strings
    - template: a path template to use to generate the path to
      the translated
      output files. The template replaces strings in square brackets
      with special values, and keeps any characters intact that are
      not in square brackets. The default template, if not specified is
      "resources/[localeDir]/[filename]". The plugin recognizes
      and replaces the following strings in template strings:
        - [dir] the original directory where the matched source file
          came from. This is given as a directory that is relative
          to the root of the project. eg. "foo/bar/strings.json" -> "foo/bar"
        - [filename] the file name of the matching file.
          eg. "foo/bar/strings.json" -> "strings.json"
        - [basename] the basename of the matching file without any extension
          eg. "foo/bar/strings.json" -> "strings"
        - [extension] the extension part of the file name of the source file.
          etc. "foo/bar/strings.json" -> "json"
        - [locale] the full BCP-47 locale specification for the target locale
          eg. "zh-Hans-CN" -> "zh-Hans-CN"
        - [language] the language portion of the full locale
          eg. "zh-Hans-CN" -> "zh"
        - [script] the script portion of the full locale
          eg. "zh-Hans-CN" -> "Hans"
        - [region] the region portion of the full locale
          eg. "zh-Hans-CN" -> "CN"
        - [localeDir] the full locale where each portion of the locale
          is a directory in this order: [langage], [script], [region].
          eg, "zh-Hans-CN" -> "zh/Hans/CN", but "en" -> "en".
        - [localeUnder] the full BCP-47 locale specification, but using
          underscores to separate the locale parts instead of dashes.
          eg. "zh-Hans-CN" -> "zh_Hans_CN"


Example configuration:

```json
{
    "settings": {
        "json": {
            "wrapper": "rb\\s*\\.getString(JS)?",
            "schemas": "./json/schemas",
            "mappings": {
                "**/appinfo.json": {
                    "schema": "http://www.lge.com/json/appinfo",
                    "method": "sparse",
                    "template": "resources/[localeDir]/appinfo.json"
                },
                "src/**/strings.json": {
                    "schema": "http://www.lge.com/json/strings",
                    "method": "copy",
                    "template": "[dir]/strings.[locale].json"
                }
            }
        }
    }
}
```

In the above example, any file named `appinfo.json` will be parsed with the
`http://www.lge.com/json/appinfo` schema. Because the method is `sparse`,
only the parts of the json file that have translated strings in them will
appear in the output. The output file name is sent to the `resources` directory.

In the second part of the example, any `strings.json` file that appears in
the `src` directory will be parsed with the schema `http://www.lge.com/json/strings`
and a full copy of the file, including the parts that were not localized,
will be sent to the same directory as the source file. However, the
localized file name will also contain the name of the locale to distinguish
it from the source file.

If the name of the localized file that the template produces is the same as
the source file name, this plugin will throw an exception, the file will not
be localized, and the loctool will continue on to the next file.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md)

## License

Copyright © 2019, 2022 JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.
