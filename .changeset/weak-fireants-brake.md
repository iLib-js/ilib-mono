---
"ilib-loctool-regex": major
---

- Added a regular expression-based parser to extract localizable
  strings from any type of textual source file such as php, java,
  or javascript.
- Regular expressions are given in the project.json config file
  plus some configuration instructing loctool how to construct
  Resource instances out of the regex match results.
