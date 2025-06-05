---
"ilib-env": patch
---

- Fixed ilib-env to get the right top scope when the platform
  is set to "mock" for testing. It will guess the top scope
  of the actual platform by trying things in the right order.
