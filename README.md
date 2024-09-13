# ilib-loctool-mrkdwn

Ilib loctool plugin to parse and localize the slack-flavored markdown
known as "mrkdwn" encoded in js files.

## File Format

A slack application can encode its strings as a simple js file with
the properties being the unique ids of the strings, and the values
being strings in mrkdwn format.

Example file:

```javascript
export default messages = {
    "unique id 1": "This is a *mrkdwn* string!",
    "unique id 2": "This _is_ also a <http://example.com|mrkdwn string>."
};
```

## Escapes

Whenever there is syntax in the mrkdwn that translators should
not touch, this plugin converts them into xml-like components.

```
This is _bold_ and *italic* text.
```

Becomes the string:

```
This is <c0>bold</c0> and <c1>italic</c1> text.
```

for the translators.

In this way, translators only have to deal with xml-like syntax
(which they are probably already familiar with) instead of the
various methods of marking up text using mrkdwn.

Each component is numbered so that the translators can switch
them around as appropriate for the grammar of their target
language.

## Code

Snippets of code are not processed. If there is an inline
snippet of code, it will be considered part of the surrounding
text and represented as an XML-like component. The text of
the inline snippet will be put into the comments of the
extracted string so that the translator knows what it is.

Example:

```
There are many instances of `numcount` used in the code.
```

becomes:

```
There are many instances of <c0/> used in the code.
```

for the translators.

Inline snippets are represented with self-closing XML tags.

## Links, References, and Footnotes

You can have references and links in your mrkdwn as normal:

```
See the code on <https://github.com/ilib-js/ilib-loctool-mrkdwn|github>.
```

which becomes:

```
See the code on <c0>github</c0>.
```

for the translators.

## Mappings

This plugin supports mappings:

```json
{
  [...]
  "settings": {
    "mrkdwn": {
      "mappings": {
        "**/foobar.js": {
          "template": "[dir]/[basename]_[locale].[extension]",
          "localeMap": {
            "fr-FR": "fr",
            "ja-JP": "ja"
          }
        }
      }
    }
  }
}
```

The mappings allow you to match a particular path name and apply particular
settings to that path, such as an output path name template. The mappings are
minimatch style.

The template follows the syntax for path name templates defined in the
the [loctool](https://github.com/iLib-js/loctool/blob/development/lib/utils.js#L1881)
itself.

The localeMap setting specifies the mapping between locales that are used
internally in the plugin, and the output locale that should be used for constructing
the file name of output files.

## Output Style

The output style of js file can be controlled via the `outputStyle` setting. This setting
allows you to output the localized strings in commonjs format or as an ESM module.

Example configuration in your loctool config file:

```json
{
    [...]
    "settings": {
        "mrkdwn": {
            "outputStyle": "esm"
        }
    }
}
```

Valid values for the `outputStyle` setting are:
- `commonjs`
- `esm` (default)

## License

This plugin is licensed under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### 1.0.0

- Initial release

