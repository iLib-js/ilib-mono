---
"ilib-tools-common": patch
"loctool": patch
---

Fix a problem with getLocaleFromPath

- regex was not anchored to the beginning of the string, so when
  you have a template like "[language]/[dir]/[filename]", it would
  match against "guides/ai-zone/index.mdx" where the language
  would end up being "des". (Last 3 letters of "guides".)
- Now with it anchored properly, it returns "" for the language
  because "guides" does not match an ISO language code.
