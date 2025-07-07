---
"ilib-lint": patch
---

- Fixed the regex for parsing URLs in the resource-url-match rule
  - does not accept a dot as the last character in the string anymore
  - now supports URL queries, hashes, and URL-encoded characters
