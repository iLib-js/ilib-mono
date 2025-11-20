---
"loctool": patch
---

- Add a warning if the mappings for a file type use a
  file name extension that does not exist in that file
  type's list of supported extensions. Previously, users would be
  confused that they put a mapping in, but none of the files they
  mapped would get read by the loctool and there would be no
  explanation of why.
