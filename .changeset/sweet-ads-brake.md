---
"ilib-lint": patch
---

- Fixed a bug in the quote style rule which would cause infinite fix loops
  - Quote detection in the source was not working properly for quote-optional
    languages, such as Italian or Swedish, causing it to apply the same fix
    over and over again
