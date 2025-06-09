---
Title: Readme for the Github-Flavored Markdown Sample
Author: JEDLSoft
Description: this is a sample of frontmatter that can be extracted and localized
---
# ilib-loctool-ghfm

Ilib loctool plugin to parse and localize Github-flavored markdown

Markdown is broken into paragraphs and phrases using the
[remark](https://www.npmjs.com/package/remark) family of parsers.
Here is a [link][footnote2] that is not localized.
Here is a [footnote][footnote1] that is localized.
Here is a [link][footnote3] that is is localized as well.

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

[footnote1]: This is a footnote
[footnote2]: http://www.sample.com/url/that/is/not/localized
<!-- i18n-enable localize-links -->
[footnote3]: http://www.sample.com/url/that/will/be/localized
<!-- i18n-disable localize-links -->
