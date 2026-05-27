---
"ilib-loctool-javascript-resource": minor
---

- Add support for the settings.javascript.template setting
  so that callers can use a regular loctool-style formatted
  path template if they like
- default behaviour is the same as it was before, which is
  to get the resource file path from the this.pathName if
  it exists or from the resourceDirs.js setting as before
