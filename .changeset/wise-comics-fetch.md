---
"ilib-localedata": patch
---

- Fixed a race condition bug where LocaleData.ensureLocale() would
  sometimes resolve to "true" when the data was not yet loaded.
