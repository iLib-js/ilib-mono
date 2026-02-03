---
"ilib-loctool-javascript-resource": patch
---

- Fixed a bug where the header/footer was treated like a path
  - if your header or footer included slashes, the whole
    thing would become normalized as a path when reality, it
    should just stay as it is.
  - eg. // this is a header became / this is a header
    because the normalize would get rid of the double slashes
