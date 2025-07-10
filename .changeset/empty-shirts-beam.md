---
"ilib-lint": minor
---

- Added ResourceSentenceEnding rule with auto-fix support
  - Matches the sentence ending punctuation in the English source string and
    the locale-sensitive sentence-ending punctuation in the target string.
  - Only checks the end of the string, not the middle.
  - Ignores any quotation marks or whitespace at the end of the string
  - Added support for both Unicode ellipsis (…) and three dots (...) in English
  - Added configuration parameter support for custom punctuation mappings per locale
  - Added documentation with developer-focused troubleshooting guide
