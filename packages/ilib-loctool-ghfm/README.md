# ilib-loctool-ghfm

Ilib loctool plugin to parse and localize github-flavored markdown

Markdown is broken into paragraphs and phrases using the
[remark](https://www.npmjs.com/package/remark) family of parsers.

## Escapes

Whenever there is syntax in the markdown that translators should
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
various methods of marking up text using markdown.

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

## HTML

You may embed HTML in the markdown and it will be processed as
above using the XML-like components.

```
This text is <b>bold</b> and contains a <span font="foo">different font</span>.
```

becomes:

```
This text is <c0>bold</c0> and contains a <c1>different font</c1>.
```

for the translators.

The attributes of certain HTML tags, such as the "title" attribute will have
its value extracted as well as a string resource.

## Comments

If you would like to place a translator's comment with a particular
section of text, you can do so with an HTML comment that starts with
"I18N" like this:

```
<!-- I18N this commment is extracted and sent along with the
     resource that follows it. -->
This is the text that is being commented upon.
```

## Links, References, and Footnotes

You can have references and links in your markdown as normal:

```
See the code on [github](https://github.com/ilib-js/ilib-loctool-ghfm).
```

which becomes:

```
See the code on <c0>github</c0>.
```

for the translators.

For links, such as the above, the target URL of the link is not usually
translated. However, you can override that for specific links with a
special HTML comment directive:

```
<!-- i18n-enable localize-links -->
See the code on [github](https://github.com/ilib-js/ilib-loctool-ghfm).
<!-- i18n-disable localize-links -->
```

In this case, the URL `https://github.com/ilib-js/ilib-loctool-ghfm` will
be extracted as a separate string resource which can be localized independently,
presumably to point to a localized version of the website.

For references with footnotes, the contents of the footnotes are usually not
translated either if they consist only of URLs. Example:

```
This text is [translated][tr].

[tr]: http://www.non.translated.url/
```

However, you can override this for specific footnotes with the same HTML comment
directive:

```
This text is [translated][tr].

<!-- i18n-enable localize-links -->
[tr]: http://www.non.translated.url/
<!-- i18n-disable localize-links -->
```

In this case, the url itself will be extracted as a separate string resource and will
be localizable.

## Mappings

This plugin now supports mappings:

```json
{
  [...]
  "settings": {
    "markdown": {
      "mappings": {
        "**/foobar.md": {
          "template": "[dir]/[basename]_[locale].[extension]",
          "frontmatter": ["Title", "Description"],
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

The frontmatter setting specifies an array of strings that represent the names
of the fields in the frontmatter that should be localized. The frontmatter is
parsed as a yaml file using the `ilib-loctool-yaml` plugin.

Any fields not listed in the frontmatter list will be preserved but not be localized.
If frontmatter is set to "true" instead of an array,
all fields will be localized. If frontmatter is set to "false", or if it is not
given, then no fields will be localized.

The localeMap setting specifies the mapping between locales that are used
internally in the plugin, and the output locale that should be used for constructing
the file name of output files.

## License

This plugin is licensed under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md)
