# ilib-loctool-tap-i18n

Ilib loctool plugin to parse and localize tap-i18n style of YAML
resource files.

## Configuration

By default, plugin will localize source `.yml` and `.yaml` files,
e.g. `/project/en.i18n.yml`,  and write localized files
to a parallel file named for the locale: `/project/ru-RU.i18n.yml`.

The plugin will look for the `tap` property within the `settings`
of your `project.json` file. The following settings are
used within the yaml property:

- `mappings`: a mapping between file matchers and an object that gives
  info used to localize the files that match it.
  The matchers are
  a [micromatch-style string](https://www.npmjs.com/package/micromatch),
  similar to the the `includes` and `excludes` section of a
  `project.json` file. The value of that mapping is an object that
  can contain the following properties:
  - `template`: a path template to use to generate the path to
    the translated output files. The template replaces strings
    in square brackets with special values, and keeps any characters
    intact that are not in square brackets. The default template,
    if not specified is "[dir[/[locale].yaml".
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
  - `commentPrefix` - a string that defines prefix for context comment for
    translators. The prefix will be stripped when comments are extracted.

Example configuration:

```json
{
  "settings": {
    "tap": {
      "mappings": {
        "**/source.i18n.yml": {
          "template": "resources/[localeDir]/source.i18n.yaml"
        },
        "src/**/en-US.i18n.yaml": {
          "template": "[dir]/[locale].i18n.yaml",
          "commentPrefix": "L10N:"
        }
      }
    }
  }
}
```

In the above example, any file named `source.i18n.yml` will be parsed.
The output files are saved to the `resources` directory under a directory
named for the locale.

Also files named `en-US.i18n.yaml` that are located in directory `src`
or any of its subdirectories will be parsed using the given `commentPrefix`
rules.

## Providing context comments

The plugin automatically parses yaml comments and assigns them
to corresponding strings as context comments.

A context comment must be placed above the source string.
It's also possible to use multiline comments.

**Same line comments are ignored!**

```yaml
header_text: "Header" # this comment is ignored

# Comment for article_title.
article_title: "Article:"

# Comment for article_summary,
# it includes view count and edit count values.
article_summary: "Stats: {view_count} views, {edit_count} edits"
```

Comments are trimmed upon extraction, so therefore there's no
difference between these two example comments:

```yaml
#comment
first: "first"
#     comment <some extra space chars here>
second: "second"
```

Multiline comments will preserve line breaks as well as spaces
on a new line (only space chars at the beginning of the
first line and at the end of the last are trimmed):

```yaml
#    Multiline comment
#    with some extra spaces in between <some extra space chars here>
```
would be parsed as
`Multiline comment\n    with some extra spaces in between`

Comments that start with the given `commentPrefix` in the mapping
will be extracted, but that prefix will be stripped out first.

Example when the mapping says that the commentPrefix is "L10N:"

```yaml
# L10N: a prefixed comment
foo: bar
```

This will extract the `foo` string with the value `bar` and the comment will
be set to `a prefixed comment`.

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.1.1

- fixed a problem between using loctool internal resources and ilib-tools-common
  resources. They are almost the same, but not completely, which lead to
  problems in producing localized versions of the tap yaml files.

### v1.1.0

- Added the ability to use the global locale mapping

### v1.0.0

- Initial version
