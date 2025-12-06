---
"loctool": patch
---

Fixed a bug where the loctool would exit immediately
and not allow a plugin to run if that plugin had an
async init method. Now it gives the async code a
chance to run before exiting.
