---
"ilib-loctool-javascript-resource": minor
---

- Add the ability to specify a header and footer in
  the output js file:
  - Use the same replacements as in output paths
    (See loctool utils.formatPath() for details.)

```json
{
  "settings": {
    "javascript": {
      "header": "const strings_[language] = ",
      "footer": "export default strings_[language];\n"
    }
  }
}
```
