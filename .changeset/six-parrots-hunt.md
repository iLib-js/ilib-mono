---
"ilib-loctool-yaml": patch
---

Avoid schema warning for non yaml files

- if we are localizing something other than a yaml file, such as
  a markdown file that has some yaml-style frontmatter in it, then
  don't try (and fail) to load a yaml schema file and then print
  a warning on the screen
