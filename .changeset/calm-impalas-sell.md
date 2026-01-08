---
"loctool": minor
---

- Split utils formatPath into formatPath and formatLocaleParams
  - this way we can format template strings with locale substitutions
    in it without treating the whole string as a path
  - plugins can now use the new function
- Switched to use the more modern ilib-locale package instead of
  the older Locale class in ilib
- Fixed a problem in the detection of whether or not a locale is the
  same as source locale. Variants were ignored, meaning that the
  pseudo locale "en-x-pseudo" (with a BCP-47 extension) was considered
  to be the same as the source locale "en". This would cause the
  loctool to never produce any output for the locale "en-x-pseudo".
