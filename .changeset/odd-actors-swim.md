---
"ilib-loctool-mrkdwn": patch
"ilib-loctool-ghfm": patch
"loctool": patch
---

- Catch exceptions when there are unbalanced tags or elements
  and print an appropriate error message on the console that
  tells the user where the problem is. That way, they have a
  chance to fix it.
