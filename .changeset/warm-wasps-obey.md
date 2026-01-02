---
"ilib-assemble": minor
---

- Add the --assemble flag to bypass all of the directory
  walking and searching and just point the tool directly
  to the assemble.mjs file that needs to be used to generate
  the locale data that is required
  - mostly used for unit or e2e testing
