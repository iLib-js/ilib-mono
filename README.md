# ilib-loctool-yaml

Ilib loctool plugin to parse and localize YAML files.

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

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.2.0
- Add support of yaml comments that enables providing context
comments for translators

### v1.1.1

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.


