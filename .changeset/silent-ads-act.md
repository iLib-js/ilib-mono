---
"ilib-lint": patch
---

- Fixed two bugs in the sentence-ending punctuation rule
  - if the target has a subordinate clause that is iterrogatory, then according to Spanish grammar rules, the inverted punctuation should come mid-sentence right before the clause. Now the rule checks for the inverted punctuation in a better way to handle this.
  - colons in the middle of the string should not be considered sentence-ending punctuation when looking backwards for the inverted punctuation in Spanish
