---
"ilib-loctool-mrkdwn": patch
---

- Fixed a bug where strings whose values contained escaped quotes (`\"` or `\'`)
  were silently skipped during extraction, so they were never sent for
  translation and were missing from the localized files.
