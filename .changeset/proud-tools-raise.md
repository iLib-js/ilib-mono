---
"ilib-lint": patch
---

- output from the json formatter is now 1 line
  compressed json format. The output is intended
  to be read by machine anyways, and having
  the output be a single line makes it easy
  to append a new json file in the "json lines" format.
