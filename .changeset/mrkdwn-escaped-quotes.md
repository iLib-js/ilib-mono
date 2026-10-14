---
"ilib-loctool-mrkdwn": patch
---

- Fixed a bug where strings whose values contained escaped quotes (`\"` or `\'`)
  were silently skipped during extraction, so they were never sent for
  translation and were missing from the localized files.
- Fixed decoding of escape sequences in source strings. An escaped backslash
  (`\\`) is now read as a single backslash, so `"C:\\new"` is no longer
  extracted as a backslash followed by a newline, and `\uXXXX` and `\xXX`
  are decoded to the characters they stand for. Existing source strings that
  contain these escapes will get new source text and need to be translated
  again.
- Fixed a bug where an empty single-quoted value (`'key': ''`) stopped the
  parsing of the rest of the file.
- Keys may now contain escaped quotes too.
