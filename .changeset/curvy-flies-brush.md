---
"ilib-loctool-mdx": patch
---

- Fixed a problem where 2-letter lower-case directories are skipped
  for localization because they look like they might be language
  codes.
- Fix was to actually check if the 2 letters are an actual ISO 639
  language code.
