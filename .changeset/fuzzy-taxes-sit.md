---
"ilib-assemble": patch
---

- Fix the issue of duplicated code inclusion of legacyilibassemble 
  - When the filePath is `index.js`, the path that should be read is not updated, causing previously read data to be included again as duplicates.
