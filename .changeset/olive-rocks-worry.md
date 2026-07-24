---
"ilib-glyphstring": minor
---

- Added GlyphString class from monolithic ilib
- supports almost the same API as the monolithic ilib supported
  except that this class has a static factory method "create"
  which loads an instance of this class asynchronously in the
  same way that other classes in this monorepo do.
