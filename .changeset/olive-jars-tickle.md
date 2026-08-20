---
"ilib-localedata": patch
---

Fixed two inconsistencies in FileCache between synchronous and asynchronous loading causing flaky tests

- A file loaded with loadFileSync was not counted by size(), so the same cached file
  reported a different count depending on whether it was first loaded synchronously or
  asynchronously. Synchronous loads now record the same promise marker in the cache
  that asynchronous loads do.
- Once a failed load was cached, both loadFile and loadFileSync returned null for it
  instead of the documented undefined. A failure that is already in the cache now
  looks the same to callers as one that was just attempted.
