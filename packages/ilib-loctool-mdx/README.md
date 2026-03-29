# ilib-loctool-mdx

Ilib loctool plugin to parse and localize MDX (Markdown + JSX) files

MDX files combine Markdown syntax with JSX components, allowing you to embed
interactive React components directly in your markdown content. This plugin
parses MDX files using the [remark](https://www.npmjs.com/package/remark)
family of parsers, specifically the [remark-mdx](https://www.npmjs.com/package/remark-mdx)
plugin.

## Escapes

Whenever there is syntax in the markdown that translators should
not touch, this plugin converts them into xml-like components.

```
This is **bold** and *italic* text.
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

## JSX Components

MDX allows you to use JSX components directly in your markdown. There are two
types of JSX elements:

### Inline JSX Elements

Inline JSX elements are embedded within text flow and participate in the
surrounding text. They are treated as non-breaking elements, meaning they don't
split the text into separate translation units.

Example:

```mdx
This is a paragraph with a <Button>Click me</Button> component.
```

becomes:

```
This is a paragraph with a <c0>Click me</c0> component.
```

### Block JSX Elements

Block JSX elements are treated as breaking nodes, meaning they split the text
into separate translation units. They appear on their own line and are not
part of the text flow.

Example:

```mdx
This is a paragraph.

<Card>
  <Title>Welcome</Title>
  <Body>This is the card body</Body>
</Card>

This is another paragraph.
```

becomes three separate translation units:
1. "This is a paragraph."
2. The card content (if it contains localizable text)
3. "This is another paragraph."

### JSX Component Attributes

For JSX components (non-HTML tags), only specific attributes are localized:
- `title`
- `placeholder`
- `label`

Example:

```mdx
<Input title="Enter your name" placeholder="John Doe" />
```

The `title` and `placeholder` attributes will be extracted as separate string
resources for localization.

For HTML tags, the plugin uses the standard localizable attributes configuration
from the loctool, which includes attributes like `title`, `alt`, etc.

## Import Statements

MDX files can include ES Module import statements to import React components:

```mdx
import { Button, Card } from './components';

# My Document

<Card>
  <Button>Click me</Button>
</Card>
```

Import statements are not localized and are preserved
as-is in the output. They are treated as breaking nodes, so any text before
or after them will be split into separate translation units.

## Frontmatter

MDX files can include YAML frontmatter at the beginning of the file:

```mdx
---
Title: My Document
Description: This is a sample document
Author: John Doe
---

# My Document

Content goes here.
```

The frontmatter is parsed using the `ilib-loctool-yaml` plugin. You can
configure which frontmatter fields should be localized using the `frontmatter`
setting in your project configuration (see Mappings section below).

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

Code blocks (fenced with ```) are not extracted and are preserved as-is.

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

Note: In MDX, all HTML-like syntax is treated as JSX, which means tags must
be properly closed (e.g., `<br />` instead of `<br>`).

## Script and Style Tags

MDX files can contain `<script>` and `<style>` tags for Mintlify and other
documentation platforms. These tags are preserved as-is and their contents
are not parsed or localized. They are treated as breaking nodes.

## Comments

MDX supports JSX-style comments:

```mdx
{/* This is an MDX comment */}
This is the text that follows.
```

MDX comments are not extracted and are ignored during localization.

If you would like to place a translator's comment with a particular
section of text, you can do so with an HTML comment that starts with
"I18N" like this:

```
{/* I18N this comment is extracted and sent along with the
     resource that follows it. */}
This is the text that is being commented upon.
```

## Links, References, and Footnotes

You can have references and links in your markdown as normal:

```
See the code on [github](https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-loctool-mdx).
```

which becomes:

```
See the code on <c0>github</c0>.
```

for the translators.

For links, such as the above, the target URL of the link is not usually
translated. However, you can override that for specific links with a
special JSX comment directive:

```
{/* i18n-enable localize-links */}
See the code on [github](https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-loctool-mdx).
{/* i18n-disable localize-links */}
```

In this case, the URL will be extracted as a separate string resource which
can be localized independently, presumably to point to a localized version
of the website.

For references with footnotes, the contents of the footnotes are usually not
translated either if they consist only of URLs. Example:

```
This text is [translated][tr].

[tr]: http://www.non.translated.url/
```

However, you can override this for specific footnotes with the same JSX comment
directive:

```
This text is [translated][tr].

{/* i18n-enable localize-links */}
[tr]: http://www.non.translated.url/
{/* i18n-disable localize-links */}
```

In this case, the url itself will be extracted as a separate string resource and will
be localizable.

## File Extensions

By default, this plugin handles files with the following extensions:
- `.mdx`
- `.md`

## Mappings

This plugin supports mappings:

```json
{
    [...]
    "settings": {
        "mdx": {
            "mappings": {
                "**/*.mdx": {
                    "template": "[localeDir]/[filename]"
                },
                "**/en-US/*.md": {
                    "template": "locale/[locale]/[filename]",
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
the [loctool](https://github.com/iLib-js/ilib-mono/blob/main/packages/loctool/lib/utils.js#L1881)
itself.

The frontmatter setting specifies an array of strings that represent the names
of the fields in the frontmatter that should be localized. The frontmatter is
parsed as a yaml file using the `ilib-loctool-yaml` plugin.

Any fields not listed in the frontmatter list will be preserved but not be localized.
If frontmatter is set to `true` instead of an array,
all fields will be localized. If frontmatter is set to `false`, or if it is not
given, then no fields will be localized.

The localeMap setting specifies the mapping between locales that are used
internally in the plugin, and the output locale that should be used for constructing
the file name of output files.

## License

This plugin is licensed under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md)
