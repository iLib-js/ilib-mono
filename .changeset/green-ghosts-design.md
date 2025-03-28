---
"ilib-lint": patch
---

- fixed a bug where the linter would throw an exception if the
  formatter named on the command-line was not known. Now, it
  prints out a proper error message.
