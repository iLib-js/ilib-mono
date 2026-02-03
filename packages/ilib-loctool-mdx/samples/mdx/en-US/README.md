---
Title: Readme for the MDX Sample
Author: JEDLSoft
Description: this is a sample of frontmatter that can be extracted and localized
---
# ilib-loctool-mdx

Ilib loctool plugin to parse and localize MDX-style markdown

Markdown is broken into paragraphs and phrases using the
[remark](https://www.npmjs.com/package/remark) family of parsers.

Here is a link[^2] that is not localized.
Here is a footnote[^1] that is localized.
Here is a [link reference][footnote3] that is is localized as well.
Here is an [immediate link](http://www.google.com/) that is not localized.

## Escapes

Whenever there is syntax in the markdown that translators should
not touch, this plugin converts them into xml-like components.

```
This is *bold* and _underscore_ text.
```

Becomes the string:

```
This is <c0>bold</c0> and <c1>underscore</c1> text.
```

for the translators.

In this way, translators only have to deal with xml-like syntax
(which they are probably already familiar with) instead of the
various methods of marking up text using markdown.

Each component is numbered so that the translators can switch
them around as appropriate for the grammar of their target
language.

[^1]: This is a footnote
[^2]: http://www.sample.com/url/that/is/not/localized
{/* i18n-enable localize-links */}
[footnote3]: http://www.sample.com/url/that/will/be/localized
{/* i18n-disable localize-links */}
