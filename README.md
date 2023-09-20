# ilib-loctool-json

Ilib loctool plugin to parse and localize json files.

This plugin can parse and localize json files by either
understanding the schema via a jsonschema v7 file, or by
defaulting to a list of key/value pairs.

## Style of JSON

By default, this plugin assumes that the json file
conforms to the [Json5 spec](http://json5.org). Earlier
forms of json are subsets
of Json5, so Json5 is the most flexible standard to
process.

This means you can put comments in the json
file itself or have trailing commas, etc.
Some of these comments are
processed along with string values to add optional
translator comments to the strings. The localized
output files will conform to older versions of json

## Methods of Localizing

Json files are localized in one of the following
methods:

1. copy. Make a copy of the entire source file
and replace values of certain properties in the
copy with translations. The copy can be sent to
any output desired directory using a template.
Copy is the default method with which
localized json files are handled.
1. sparse. Make a copy of the source file where only
the localized properties appear. The copy has the same
structure as the original json file, but only properties
where the value is localized appear in the output.

The first method, localizing the entire file, has the
advantage that you don't need to change your code in
order to read the translated file. You just need to pick
the right file for the current locale.

The second method is similar to the
first method above, except that it can save space
because all of the non-localizable data in the original
json file is not duplicated.
In this case, you would need to load in the English file
first, then mix-in the localized file to override all
the localizable strings in order to create the full
data with localized data embedded in it.

## Key/Value Pairs

In the absence of any schema information, a default
schema will be applied. The
plugin will assume that the json file is a simple object
where the property names are the keys and the property
values are the strings to translate.

Example:

```json
{
    "unique id 1": "first string to translate",
    "unique id 2": "second string to translate",
    etc.
}
```

Essentially, this means that we assume that the file has
the following json schema:

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "strings-schema",
    "type": "object",
    "description": "A flat object of properties with localizable values",
    "additionalProperties": {
        "type": "string",
        "localizable": true
    }
}
```

## Configuring the Plugin

The plugin will look for the `json` property within the `settings`
of your `project.json` file. The following settings are
used within the json property:

- schemas: a string naming a directory full of json schema files, or
  an array of strings naming some json schema files or directories to
  load. If the json file
  does not fit any of the schema (ie. it does not validate according to
  any one of the schema), then that file will be skipped and not localized.
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
    - localeMap: an output locale map that maps the locale used in the
      translations to a different locale for use in the file name template.
      For example, an app may wish to use the locale specifier "zh-CN"
      instead of the full "zh-Hans-CN" for some output files, but not
      all of them. In this case, a locale map for this template mapping
      is how this can be achieved. Any locale not listed in the mapping
      will be used as-is. The overall [shared] locale map is also applied
      if there is no locale map in the template mapping for a particular
      locale.

Example configuration:

```json
{
    "settings": {
        "json": {
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
                    "template": "[dir]/strings.[locale].json",
                    "localeMap": {
                        "zh-Hans-CN": "zh-CN"
                    }
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


## Extensions to JSON Schema

In regular JSON Schemas, there is no built-in way to indicate that any value
is localizable. However, the [JSON Schema spec](https://json-schema.org/specification.html)
allows for creating extensions
to the keywords of your json schema and specifies that implementation must
ignore any keywords that it does not recognize.

### The `localizable` Keyword

This plugin recognizes the new `localizable` keyword as an extension. The
`localizable` keyword specifies that the value of a property should be
localized by the methods provided above. By default, values are not
localizable unless explicitly specified using the `localizable` keyword.

The `localizable` keyword is ignored for null or undefined values. For
the primitive types string, integer, number, or boolean values, the value
is directly localizable. Each property will result in a translation unit
that the translators may localize.

When the `localizable` keyword is given for arrays,
every item in the array is localizable and must be of a primitive type
(string, integer, number, or boolean). If any array entries are not of
a primitive type, an exception will be thrown and the localization will
be halted.

When the `localizable` keyword
is given for an object type, that object encodes a plural string. The
subproperties allowed in that object are those defined in the [Unicode
plural rules](http://cldr.unicode.org/index/cldr-spec/plural-rules):

- zero
- one
- two
- few
- many
- other

The "one" and the "other" property are required for source files in English.
Other languages will have different combinations of plural categories.

Example json schema file:

```json
{
    "$id": "",
    "title": "an location data",
    "properties": {
        "name": {
            "type": "string",
            "description": "the name of this address, like 'work' or 'home'. This string is not localized",
            "$comment": "note that this is not localizable"
        },
        "country": {
            "type": "string",
            "localizable": true,
            "description": "the name of the country localized the the current language"
        },
        "latitude": {
            "type": "number",
            "localizable": true,
            "description": "an example of a localizable number"
        },
        "places": {
            "type": "array",
            "localizable": true,
            "items": {
                "type": "string"
            }
        },
        "plural": {
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "localizable": true,
                "required": [
                    "one",
                    "other"
                ],
                "properties": {
                    "zero":  {"type": "string"},
                    "one":   {"type": "string"},
                    "two":   {"type": "string"},
                    "few":   {"type": "string"},
                    "many":  {"type": "string"},
                    "other": {"type": "string"}
                },
                "additionalProperties": false
            }
        }
    }
}
```

The `localizable` keyword is also ignored for `const` value types, as the
value is supposed to remain constant.

For strings that have an `enum` keyword, each of the values in the `enum` will
not be translated as well, as the code that reads this json file is explicitly
expecting one of the given fixed values.

## JSON File Generation

When you create a new, empty JsonFile instance that is not backed
by a json file on disk, this plugin can generate the json file
text automatically. This allows this plugin to be used as a resource
file type for other plugins.

```javascript
    // path does not have to exist
    var jsonFile = jsonFileType.newFile(undefined, {locale: "fr-FR"});

    // the string, plural and array resource added in this example
    // already have translations in them to fr-FR
    jsonFile.addResource(stringResource);
    jsonFile.addResource(pluralResource);
    jsonFile.addResource(arrayResource);

    // first param is the translation set from the xliff files
    // and can be undefined for generated json files because
    // the resources already have the translations in them
    var text = jsonFile.getLocalizedText(undefined, "fr-FR");
```

### Generated File Name

If the `newFile` method is called without a path name, as in the above example,
the default mapping will apply, and the output file will follow the default
mapping's template. If a path name is given, but does not match any mapping,
it will also use the default mapping. Otherwise, it will use the matched mapping
to find the output file name.

### Generation of Each Resource Type

The generation of resources into json has a hard-coded schema for now.
(This may change in the future.) The hard-coded format is one that
works with ilib's ResBundle class so that the output json can be
loaded as string resources.

For strings, they are output as simple key/value pairs:

```json
{
    "key": "value"
}
```

For arrays, they are output as json arrays:

```json
{
    "key": [
        "value at index 0",
        "value at index 1",
        etc
        "value at index N"
    ]
}
```

For plurals, they are output as ilib plural strings:

```json
{
    "key": "one#'one' category string|few#'few' category string|#'other' category string"
}
```

## Not a Validator

Please note that this plugin is *not* a json schema validator, though it
works in similar ways. If the json being parsed does not conform to
the given schema, no errors or exceptions will be thrown, but it will
print some warnings to the output. The strings will merely not be
extracted/localized as expected.

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.5.3

- update dependencies
- convert all unit tests from nodeunit to jest

### v1.5.2

- fixed a bug where the "anyOf", "allOf", "oneOf", and "not" keywords
  in json schemas were not handled properly (or at all!) causing
  the plugin to miss strings that should be localized
- update dependencies

### v1.5.1

- update dependencies

### v1.5.0

- added support for locale maps when generating output path names

### v1.4.0

- added the ability to read json files as translated resource files
    - if the mappings include a template and the path name matches, it
      will use the locale gleaned from the path name when extracting
      resources

### v1.3.0

- added the ability to use this plugin as the output resource file format for other
  plugins
    - added addResource() to the JsonFile
    - changed write so that if there is no existing json, it will generate
      a new json file using hard-coded output templates

### v1.2.5

- Use the logger provided by the loctool instead of trying to log things on our own
- Use the formatPath and getLocaleFromPath functions provided by the loctool instead
  of our own

### v1.2.4

- normalize the path before matching against the mappings so that the matching
  works better

### v1.2.3
- fix issue of the parser that resulted in skipping objects with
  single boolean field which equals `false`

### v1.2.2

- Fix a bug where the pseudo locales were not initialized properly. This fix gets
  the right set of locales from the project settings to see if any of them are pseudo locales.

### v1.2.1

- Fixed bug where it was not generating pseudo localized text properly for missing
  translations when pseudo is turned on

### v1.2.0

- add support for $refs in array schema definitions

### v1.1.1

- few README.md files (this file!)

### v1.1.0

- extended array support:
    1. corrected handling of primitive types. Values are casted to their initial type upon translation
    2. added support for array of objects
- fixed a bug of a copy method that results in json parts, that are not defined in the schema,
to be removed from localized files

### v1.0.1

- fixed a bug where plural strings resources were not extracted to the new
  strings file properly

### v1.0.0

- initial version
- support json schema and also default schema (key/value pairs)
