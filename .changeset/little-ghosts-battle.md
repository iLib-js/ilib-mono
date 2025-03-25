---
"ilib-po": patch
---

Fixed Parser attempting to use non-existent plural forms definitions - now it properly falls back to English if the form is not defined for a given language.
