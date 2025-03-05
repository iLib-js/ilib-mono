---
"ilib-tools-common": minor
---

- Added Escaper class to the tools library
  - escaperFactory() generates the appropriate escaper instance
    for the given programming language/syntax
  - Escaper.unescape() takes a string as it would be encoded in
    a source file, and transforms it into how it would be
    represented in memory while the program is running
  - Escaper.escape() does the converse
  - original code was extracted from various loctool plugins
  - this library is intended to be used with any loctool or ilib-lint
    plugin so that we do escaping/unescaping the same way no
    matter which plugin we are using
