---
"ilib-xliff": minor
---

Keep the text of every translator note on a translation unit instead of only the first one. XLIFF 1.2 allows multiple `<note>` elements on a trans-unit, and XLIFF 2.0 allows multiple `<note>` elements inside of the `<notes>` element, so the comment on a translation unit now contains the text of all of them in document order, joined with newlines. The comment is still written back out as a single note.
