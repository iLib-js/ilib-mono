---
"ilib-loctool-ghfm": minor
---

- Fixed a bug where a particular HTML tag caused regular expression
  chaos which caused the entire loctool to hang. Now the code uses
  the html parser to check HTML tags instead of an overcomplicated
  regular expression.
- Added support for Markdown that contains handlebars syntax
