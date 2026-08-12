---
"ilib-localedata": patch
---

- Fixed a race condition bug where LocaleData.ensureLocale() would
  sometimes resolve to "true" when the data was not yet loaded.
- The LocaleData constructor, loadData(), and getLocaleData() now throw
  Error instances instead of bare strings. Callers that only report the
  error do not need to change, but callers that compare the thrown value
  against a string should now read its "message" property instead.
- MergedDataCache no longer double-merges root or duplicate und-REGION
  sublocales, which was concatenating arrays (e.g. address fields) twice.
- Fixed synchronous loading in browsers. Asking the constructor for sync
  operation with a loader that cannot load synchronously now falls back to
  asynchronous operation as documented instead of throwing, checkCache()
  again reports data that was preloaded but not merged yet, and a merge no
  longer fails when there is nothing left that can be loaded synchronously.
  Together these restore reading preassembled locale data synchronously
  after ensureLocale() or cacheData().
- Data that ensureLocale() preloaded is now found even when the app has no
  global roots, in which case it is cached under the default "./locale" root
  instead of the calling package's own path. Without this, a synchronous read
  in a browser could not see the data that was just preloaded for it.
- A synchronous read that the loader could not even attempt no longer marks
  the file as tried, which was making a later asynchronous read of the same
  file report that there is no data for it.
