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

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.11.2

- Updated dependencies
- converted unit tests from nodeunit to jest

### v1.11.1

- Updated dependencies

### v1.11.0

- Now uses newest yaml parser which puts a hash of the source path name in the
  key for each frontmatter field. This way, the Title field in different
  md files will have different resource keys and therefore can be translated
  separately.

### v1.10.0

- added localeMaps to the mappings

### v1.9.1

- fixed a bug where URLs in direct links were added to the new strings set
  even when the localize-links directive was turned off. If the "fully
  translated" flag was also turned on, then the plugin would think a file was
  not fully translated because these links appear in the new strings set
  and so it would not produce the localized version of the file.

### v1.9.0

- added the ability to localize URLs in direct links when the localize-links
  directive is turned on

### v1.8.4

- fixed a bug where markdown embedded inside of flow HTML was not being parsed
  properly. Flow HTML and markdown should be able to contain each other.

### v1.8.3

- fixed a bug where strings inside of flow HTML were not being extracted or
  localized. Flow HTML is where the HTML tags span multiple lines. HTML that
  was on a single line was already handled correctly--it is the multiple-lines
  that threw off the parser. Example of flow HTML:

```
  <span class="myclass">
  This text is on a separate line.
  </span>
```

### v1.8.2

- fixed a bug where the new and pseudo strings for the front matter were not
  being generated properly

### v1.8.1

- fixed incorrect documentation (ie. the above text!)
- mark files as not fully translated if there is pseudo translation

### v1.8.0

- added support for settings mappings
- added support for parsing and localizing frontmatter fields

### v1.7.2

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.

### 1.7.1

* Fixed an "Unbalanced component error" while parsing footnote definitions

### 1.7.0

* Added support for markdown footnotes using remark-footnote
* Don't test on node 6 any more -- unit tests do not pass on node 6
  because of a dependency which we can't really fix ourselves

### 1.6.0

* Added support for the "fullyTranslated" setting in the frontmatter if
the fullyTranslated setting is turned on in the loctool and the current
file has all of its strings fully translated.

### 1.5.1

* Updated dependencies so that this plugin can work on nodejs v6 still
  without node-gyp problems.

### 1.5.0

* added a "fullyTranslated" setting for the markdown code. This makes sure
  that if a file does not have all of its translations, then that file is
  produced in the source language.
    * Also produces a file in the project root called `translation-status.json`
      that details which files were fully translated and which were not
* Fixed a bug where markdown tables were not handled properly
* Fixed a bug where inline code was not handled properly if it was the
only thing in the localizable segment. Inline code should only be
localized if it is in the middle of or adjacent to localizable text.

### 1.4.1

* Fixed a bug where self-closed tags like <br/> in markdown files were not handled properly,
causing exceptions that complained about syntax errors

### 1.4.0

- Add support for localizing links and link references.

By default, URLs are not localizable, as the majority are the same
in all languages. Sometimes, however you want to be able to give a
different URL for each locale. With this new features, you can turn
on link localization.

To localize a link in the text, put a localize-links directive around
it, which is an lint-style HTML comment. Example:

```markdown
There are
<!-- i18n-enable localize-links -->
[fifty](http://www.example.com/)
<!-- i18n-disable localize-links -->
of them for sale.
```

The text "fifty" is localized along with the rest of the sentence in the
string:

```
There are <c0>fifty</c0> of them for sale.
```

Note the c0 tags denote where the link goes. The directives, being HTML
comments, are not included in the string to translate.

The URL itself appears as a separate string to translate.

Localizing a link reference is very similar. Surround the reference
definition with a localize-links directive:

```markdown
There are [fifty][url] of them for sale.

<!-- i18n-enable localize-links -->
[url]: http://www.example.com/ "link title"
<!-- i18n-disable localize-links -->
```

The link title for link reference definitions is included as a separate string
to translate.

### 1.3.0

- The plugin now adds a translator comment/note for inline code so that the
  translator can know what the text of the self-closing components is.
- Minimum node version to run this plugin is now v10

### 1.2.6

- Add support for shortcut and full link references
    - Shortcut references are converted back to full so that the title of the
      reference can be translated to something different than the [possibly]
      English label of the shortcut.

### 1.2.5

- Handle valueless HTML attributes properly

### 1.2.4

- The previous fix where HTML comments were not recognized and skipped properly
was only fixed for the parsing side of this plugin. Now it is fixed for the
localization side as well.

### 1.2.3

- Fixed a bug where HTML comments were not recognized and skipped properly
if there was whitespace/indentation before them in the source file.

### 1.2.2

- Fixed reference link support. If there is text in a reference link, then it will
be included in the text to localize.

