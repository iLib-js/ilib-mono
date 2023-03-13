# ilib-loctool-yaml

Ilib loctool plugin to parse and localize YAML files.

## Configuration

By default, plugin will localize source `.yml` and `.yaml` files,
e.g. `/project/en.yml`,  and write localized file
to a subfolder: `/project/resources/ru-RU/en.yml`.

The plugin will look for the `yaml` property within the `settings`
of your `project.json` file. The following settings are
used within the yaml property:

- mappings: a mapping between file matchers and an object that gives
  info used to localize the files that match it. This allows different
  yaml files within the project to be processed with different schema.
  The matchers are
  a [micromatch-style string](https://www.npmjs.com/package/micromatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of that mapping is an object that
  can contain the following properties:
  - `template`: a path template to use to generate the path to
    the translated output files. The template replaces strings
    in square brackets with special values, and keeps any characters
    intact that are not in square brackets. The default template,
    if not specified is "resources/[localeDir]/[filename]".
    The plugin recognizes and replaces the following strings
    in template strings:
    - [dir] the original directory where the matched source file
      came from. This is given as a directory that is relative
      to the root of the project. eg. "foo/bar/strings.yaml" -> "foo/bar"
    - [filename] the file name of the matching file.
      eg. "foo/bar/strings.yaml" -> "strings.yaml"
    - [basename] the basename of the matching file without any extension
      eg. "foo/bar/strings.yaml" -> "strings"
    - [extension] the extension part of the file name of the source file.
      etc. "foo/bar/strings.yaml" -> "yaml"
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
  - `excludedKeys` - an array of keys that must be excluded from a
    ResultSet. Excluded key will also affect all its children
    and ignore them too. It only allows the direct key exclusion,
    i.e. a sequence of keys can not be used.
  - `commentPrefix` - a string that defines prefix for context comment for
    translators. Only comments that start with the provided string will
    be extracted and added to ResultSet, all other are ignored.

Example configuration:
```json
{
  "settings": {
    "yaml": {
      "mappings": {
        "**/source.yml": {
          "template": "resources/[localeDir]/source.yaml"
        },
        "src/**/strings.yaml": {
          "template": "[dir]/strings.[locale].yaml",
          "excludedKeys": [
            "one",
            "another",
            "test"
          ],
          "commentPrefix": "L10N:"
        }
      }
    }
  }
}
```

In the above example, any file named `souce.yml` will be parsed.
The output files are saved to the `resources` directory.

Also files named `strings.yaml` that are located in directory `src`
or any of its subdirectories will be parsed using specified `excludedKeys`
and `commentPrefix` rules.

## Providing context comments

The plugin automatically parses yaml comments and assigns them
to corresponding strings as context comments.

A context comment must be placed above the source string.
It's also possible to use multiline comments.

**Same line comments are ignored!**

```yaml
header_text: "Header" #ignored comment
# Comment for article_title.
article_title: "Article:"
# Comment for article_summary,
# it includes view count and edit count values.
article_summary: "Stats: {view_count} views, {edit_count} edits"
```

Comments are trimmed upon extraction, therefore there's no
difference between these two comments.
```yaml
#comment
first: "first"
#     comment <some extra space chars here>
second: "second"
```

Multiline comments will preserve line breaks as well as spaces
on a new line (only space chars at the beginning of the
first line and at the end of the last is trimmed):

```yaml
#    Multiline comment
#    with some extra spaces in between <some extra space chars here>
```
would be parsed as
`Multiline comment\n    with some extra spaces in between`

## Legacy setup
**Important: automatic schema files lookup is disabled once `mappings`
section is specified in the `project.json`! Use configration parameters
in a mapping as described above.**

Prior mappings introduction that happened in v1.3.0 the plugin behavior
was configurable via `*-schema.json` files.

For each source file plugin will search for a schema file named
`<sourceFileName>-schema.json` in the same dirctory the source
file is located.

### Schema file

Example of `*-schema.json` file:
```json
{
  "useLocalizedDirectories": false,
  
  "excluded_keys": [
    "testKey",
    "anotherExcludedKey"
  ],
  
  "outputFilenameMapping": {
    "ru-RU": "/project/translations/ru.yml"
  }
}
```

`useLocalizedDirectories` - specifies whether localized file should
be placed in a separate directory. Default: `true`

`excluded_keys` - array of keys to be excluded from localization
(in `v1.3.0` this key was changed to `excludedKeys`, nevertheless the
original key with an underscore is still supported even in mappings)

`outputFilenameMapping` - array of mappings that
specify output path for a locale: `<localeName>: <path`

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.4.1

- update dependencies

### v1.4.0

- Add a hash of the file name into the key for each resource so that
resource "a" from file1 does not conflict with resource "a" in file2.
- Minimum version of node that this can run on is now v10

### v1.3.0
- Add support for mappings in yaml config that allows custom output
file naming and use of schema per-mapping
- Add `commentPrefix` key to the schema that allows to specify prefix
for context comments that are extracted along with source strings

### v1.2.0
- Add support of yaml comments that enables providing context
comments for translators

### v1.1.1

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.


