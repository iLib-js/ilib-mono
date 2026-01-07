---
"loctool": minor
---

- Split utils formatPath into formatPath and formatLocaleParams
  - this way we can format template strings with locale substitutions
    in it without treating the whole string as a path
  - plugins can now use the new function
- Switched to use the more modern ilib-locale package instead of
  the older Locale class in ilib
