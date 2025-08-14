---
"ilib-lint": minor
---

- Add new all capitals rule
  - If the source string contains 2 or more alphabetic letter
    characters and all alphabetic letter characters are upper-case,
    and the target language uses a writing script that also
    supports casing, then the target string should also be in
    all upper-case to echo the style of the source.
  - all characters that are not alphabetic letters are unmodified
  - all strings written in scripts that do not support casing
    are unmodified
  - auto-fix available to automatically replace the target text
    with the upper-cased version of the string. The text is
    upper-cased locale-sensitively using ilib-casemapper.
