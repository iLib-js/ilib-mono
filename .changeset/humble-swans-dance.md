---
"ilib-loctool-pendo-md": patch
---

- Fixed a bug where the plugin would make factorial file growth
  - The PendoXliffFileType.getLocalizedPath was not stripping off
    the old locale before appending the new locale, causing a
    factorial growth in the number of files as the locales
    multiplied with each other appending more and more locales
