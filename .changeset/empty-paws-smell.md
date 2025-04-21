---
"ilib-tools-common": minor
---

- Added resfile support to the Resource class
  - documents which resource file a translation unit
    was read from, if any
  - only defined for resource files like xliff,
    properties, or PO files. It is undefined if the
    trans unit did not come from a resource file.
  - added getResFile() to return the resfile value
- Added ability for the ResourceXliff file to add
  the resfile property to every Resource read from
  an xliff file
