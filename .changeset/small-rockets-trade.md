---
"ilib-tools-common": minor
---

- Pushed hashKey() and cleanHashKey() methods up to the superclass
  - All of string, plural, and array resources already
    supported them, but the superclass Resource did not
  - By pushing them up to the superclass, you can rely on the
    being there no which subclass you have a reference to
