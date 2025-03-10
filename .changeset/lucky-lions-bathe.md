---
"ilib-loctool-regex": patch
---

- Fixed a bug where an empty source string derails
  the parsing of the rest of the file. Now, it skips
  the match it found with the empty source and
  continues parsing after that.
