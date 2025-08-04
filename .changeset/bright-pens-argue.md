---
"ilib-loctool-ghfm": patch
---

- Fixed a bug where some whitespace was not being added
  to translatable strings properly during extraction but
  not during localization, meaning that some strings were
  not able to be translated because the string did not
  match the translations
