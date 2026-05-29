---
"loctool": minor
---

- Add support for the --configFileBaseName parameter that allows
  callers to use a different base file name for loctool config files
  in case there is a conflict with some other packages
  that uses "project.json" as its config file as well.
- By default, loctool now recognizes both loctool-config.json and
  project.json as config files during the tree walk. loctool init
  writes loctool-config.json unless --configFileBaseName is set.
- Add support for recognizing config files as being loctool
  style config files or not. If not recognized, then they are
  not used to indicate a new subproject.
