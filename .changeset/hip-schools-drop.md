---
"ilib-lint-common": minor
---

- You are now able to return a boolean value from your
  implementation of Fixer.applyFixes(). This value tells the
  linter whether or not the representation needs to be reparsed.
  If you return a falsy value, it will serializer and then
  reparse. If you return true, the linter can keep the old
  representation and just re-apply the rules to it.
  Default is no return value from applyFixes() so that it
- Added abstract method Fix.getApplied() to tell whether or
  not the given fix has been applied to the IR yet
