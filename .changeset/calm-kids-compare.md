---
"loctool": patch
---

- Deprecate the xliffsDir setting to be replaced by the
  translationsDir setting instead. The reason is that
  this directory may now contain translations that are
  not encoded as xliff files but in some other resource
  file format instead!
    - all users should transition to using the
      --translationsDir command-line option and the
      "translationsDir" property in the settings in
      their ilib-lint-config.json file.
    - xliffDir will be removed in the next major
      update to loctool
