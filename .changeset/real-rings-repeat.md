---
"ilib-tools-common": minor
---

Add capabilities to parsePath and formatPath

- if the parser cannot match the template, we can at least grab
  some basic path info like dir, basename, and extension from the
  path
- if formatPath is not given the parts to format into the path,
  but it is given the sourcepath parameter, then it can glean
  some of the parts by calling parsePath on the sourcepath
- has fallbacks for locale parts and path parts in the parser
- fixed a bug where there were multiple dots in the file name
  which confused the basename and extension regexes in parsePath
