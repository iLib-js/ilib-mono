---
"loctool": patch
---

Fixed a bug where resources with a source that is empty or contains only
whitespace were written out to the extracted and new strings files, producing
translation units with an empty source element that some translation
management systems cannot process. Such resources are now filtered out before
the files are written, and a warning naming the resource is printed for each
one that is skipped.
