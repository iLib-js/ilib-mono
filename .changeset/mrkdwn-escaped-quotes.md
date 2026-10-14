---
"ilib-loctool-mrkdwn": patch
---

- Fixed a bug where strings whose values contained escaped quotes (`\"` or `\'`)
  were silently skipped during extraction, so they were never sent for
  translation and were missing from the localized files.
- Fixed decoding of escape sequences. Keys and values containing escape
  sequences (including `\\`, `\uXXXX`, `\xXX`, `\/`) are now decoded, so
  `"C:\\new"` is no longer extracted as a backslash followed by a newline.
  Affected values get new source text and need to be translated again, and
  affected keys get new resource IDs.
- Fixed a bug where an empty single-quoted value (`'key': ''`) stopped the
  parsing of the rest of the file.
- Keys may now contain escaped quotes too.
