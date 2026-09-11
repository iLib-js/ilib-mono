---
"loctool": patch
---

Fixed a bug where resources with a source that is empty or contains only
whitespace were written out to the extracted and new strings files, producing
translation units with an empty source element that some translation
management systems cannot process. Such resources are now filtered out before
the files are written, and a warning naming the resource is printed for each
one that is skipped.

This applies to individual array items and plural categories as well, not just
to whole resources. An array item or plural category that is empty or contains
only whitespace is now left out of the xliff instead of being serialized as a
trans-unit with an empty source. When a plural category has no real source text
but the "other" category does, the source of the "other" category is used
instead of dropping the translation.
