# ilib-loctool-html

Ilib loctool plugin to parse and localize json files.

This plugin can parse and localize json files by either
understanding the schema via a jsonschema v7 file, or by
defaulting to a list of key/value pairs.

## Style of JSON

By default, this plugin assumes that the json file
conforms to the Json5 spec. Earlier forms of json are subsets
of Json5, so Json5 is the most flexible standard to
process.

This means you can put comments in the json
file itself if you like. Some of these comments are
processed along with string values to add optional
translator comments to the strings. The localized
output files will conform to older versions of json

## Methods of Localizing

Json files are localized in one of three different
methods:

1. By making a copy of the entire source file
and replacing values in the copy with translations. The
copy can be put into the directory of your choice and
named after the locale. This is the default method that
localized json files are handled.
1. By making a copy of the source file where only
the localized properties appear.
1. By replacing a string value in the source file
   with an object that maps the name
   of the locale to the translation of that string:

    ```json
    {
        "prop": "English example"
    }
    ```

   becomes:

    ```json
    {
        "prop": [
            "en": "English example",
            "fr": "Example française",
            "de": "Deutsche Beispiel"
        ]
    }
    ```

1. By replacing a string value in the source file with
   an array of objects that describe the translations:

    ```json
    {
        "prop": "English example"
    }
    ```

   becomes:

    ```json
    {
        "prop": [
            {
                "locale": "en",
                "value": "English example"
            },
            {
                "locale": "fr": ,
                "value": "Example française"
            },
            {
                "locale": "de": ,
                "value": "Deutsche Beispiel"
            }
        ]
    }
    ```

The first method, localizing the entire file, has the
advantage that you don't need to change your code in
order to read the translated file. You just need to pick
the file for the right locale.

The second method is similar to the
first method above, except that it can save space
because all of the non-localizable data is not duplicated.
In this case, you would need to load in the English file
first, then mix-in the localized file to override all
the localizable strings.

## Key/Value Pairs

Since this method is easier, we will describe this one
first. In the absence of any other information, this
plugin will assume the json file is a simple object
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
the following jsonschema:

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://github.com/ilib-js/LocalizableJson",
    "type": "object",
    "description": "A collection of properties with localizable values",
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
  an array of strings naming some json schema files. If the json file
  does not fit any of the schema (ie. it does not validate according to
  the schema), then that file will be skipped and not localized.
- mappings: a mapping between file matchers and an object that gives
  info used to localize the files that match it. This allows different
  json files within the project to be localized in different ways.
  The matchers are
  a [minimatch-style string](https://www.npmjs.com/package/minimatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of tha mapping in an object that
  can contain the following properties:
    - schema: schema to use with that matcher. The schema is 
      specified using the `$id` of one of the schemas loaded in the
      `schemas` property above.
    - method: one of "copy", "stringsOnly", "spreadSmall",
      or "spreadBig".
        - copy: make a copy of the source file and localize the
          string contents
        - stringsOnly: make a copy of the source file but only
          include localized strings
        - spreadSmall: replace each localizable string in the
          source file with an object that maps locale names to
          translated strings
        - spreadBig: replace each localizable string in the source
          file with an array of objects that give the translations
          of the strings
    - template: a file name template to use to name the translated
      output files. The template replaces strings in square brackets
      with special values, and keeps any characters intact that are
      not in square brackets. If the method is set to "spreadSmall"
      or "spreadBig", the template is not required because this plugin
      will modify the source file directly. The plugin recognizes
      and replaces the following things in template strings:
        - [dir] the original directory where the matched source file
          came from. This is given as a directory that is relative
          to the root of the project. eg. "foo/bar/strings.json" -> "foo/bar"
        - [filename] the file name of the matching file. 
          eg. "foo/bar/strings.json" -> "strings.json"
        - [basename] the basename of the matching file without any extension
          eg. "foo/bar/strings.json" -> "strings"
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
            "schemas": "./json/schemas",
            "mappings": {
                "**/appinfo.json": {
                    "schema": "http://www.lge.com/json/appinfo",
                    "method": "stringsOnly",
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

## Extensions to JSON Schema

In regular JSON Schemas, there is no built-in way to indicate that any value
is localizable. However, the JSON Schema spec allows for creating extensions
to the keywords of your json schema and specifies that implementation must
ignore any keywords that it does not recognize.

### The `localizable` Keyword

This plugin recognizes the new `localizable` keyword as an extension. The
`localizable` keyword specifies that the value of a property should be
localized by the methods provided above. By default, values are not
localizable unless explicitly specified using the `localizable` keyword.
The `localizable` keyword only makes sense for string, boolean, and
number value types. For all other types, it is ignored.

Example json schema file with localizable strings, booleans, and numbers
and a few non-localizable strings:

```json
{
    "$id": "",
    "title": "an address data file",
    "properties": {
        "name": {
            "type": "string",
            "description": "the name of this address, like 'work' or 'home'. This string is not localized"
        },
        "country": {
            "type": "string",
            "localizable": true,
            "description": "the name of the country localized the the current language"
        },
        "houseNumber": {
            "type": "number",
            "localizable": true,
            "descripton": "This may be rewritten in the local language's system of digits"
        },
        "streetAddress": {
            "type": "string",
            "localizable": false,
            "description": "This one is explicitly set to `false` which is already the default."
        },
        "locality": {
            "type": "string",
            "localizable": true,
            "description": "The name of the locality (town, city , etc.) in the local language"
        },
        "residence": {
            "type": "boolean"
            "localizable": true,
            "description": "Whether the address is a residence. true = reside, false = business"
        }
    }
}
```

The `localizable` keyword is also ignored for `const` value types, as the
value is supposed to remain constant.

For strings that have an `enum` keyword, each of the values in the `enum` will
not be translated as well, as the code is explicitly expecting one of the given
values.

### The `$comment` Keyword

If a string has a `$comment` keyword in the schema, then that comment will be
included with the string when it is sent to the translators. If the json file
itself includes a Json5 style i18n comment, that will take precedence, as that is
more specific to that particular string.

Here is an example of a schema and a json file, and how the comments are extracted.

schema.json:

```json
{
    "title": "a json schema",
    "properties": {
        "a": {
            "type": "string",
            "localizable": true,
            "$comment": "i18n: an 'a' string"
        },
        "b": {
            "type": "string",
            "localizable": true,
            "$comment": "i18n: an 'b' string"
        }
    }
}
```

x/y/file.json:

```json
{
    "a": "this string has no comment",
    // i18n: this is the translator's note
    "b": "this string does have a json5 comment"
}
```

Note that the comment needs to start with the string "i18n: "
in order to be extracted. Any other comments will be ignored.

Strings extracted are:


| id   | string   | translator's note  | where from  |
| :----  | :--------  | :-------  | :------  |
| a    | this string has no comment  | an 'a' string' | from the schema.json |
| b    | this string does have a json5 comment  | this is the translator's comment | from the file.json |


## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.0.0

- initial version
- support json schema and also default schema (key/value pairs)
