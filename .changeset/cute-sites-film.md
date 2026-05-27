---
"loctool": minor
---

- Add support for the --configFileBaseName parameter that allows
  callers to use a different base file name for loctool config files
  in case there is a conflict with some other packages
  that uses "project.json" as its config file as well.
- Add support for recognizing config files as being loctool
  style config files or not. If not recognized, then they are
  not used to indicate a new subproject.
