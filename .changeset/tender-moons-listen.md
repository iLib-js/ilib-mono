---
"ilib-loader": patch
---

- The webpack loader now falls back to requesting only the file name when the
  path it derived from the root directory does not resolve. Apps that point the
  "calling-module" alias straight at their directory of preassembled locale
  files could not load any of that data, because the root directory in the path
  (eg. "locale/de-DE.js") is not part of the request in that setup.
