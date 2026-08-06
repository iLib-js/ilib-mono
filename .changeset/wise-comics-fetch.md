---
"ilib-localedata": patch
---

- Fixed a race condition bug where LocaleData.ensureLocale() would
  sometimes resolve to "true" when the data was not yet loaded.
- The LocaleData constructor, loadData(), and getLocaleData() now throw
  Error instances instead of bare strings. Callers that only report the
  error do not need to change, but callers that compare the thrown value
  against a string should now read its "message" property instead.
