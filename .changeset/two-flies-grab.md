---
"ilib-lint": patch
---

- Fixed a bug where whitespace at the end of the target string would cause problems with the
  sentence-ending punctuation rule
  - Sentence-ending punctuation would not be found if there was one or more whitespace chars
    at the end of the target string. (Source string was okay, though.)
  - Rule now trims the whitespace from the target string before checking it.
