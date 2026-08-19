---
"ilib-loader": patch
---

- Include variant locales (such as de-DE-SAP) and 3-letter language codes (such as zxx-Hebr-XX) in the webpack loader's dynamic import context so browser bundles can load those assembled locale files.
