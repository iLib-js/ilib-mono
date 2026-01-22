---
"ilib-tools-common": patch
---

- Fix an issue in the webOS XLIFF file that causes data loss when entries have the same key but different sources.  
  Update to add a sourceHash property to the Resource, and if the value exists, use it to generate a hashkey.
