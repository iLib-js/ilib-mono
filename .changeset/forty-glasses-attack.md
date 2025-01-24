---
"loctool": minor
---

Modified the way loctool reads translated resource files

- The way loctool reads resource files from the xliffsDir directories
  has changed.
  - Previously, it would read `[dir]/*.xliff` and now it reads `[dir]/**/*.xliff`
    or `[dir]/**/*.po`. That is, it reads each directory recursively.
- renamed -x and --xliffDir to -t and --translations but the old
  command-line arguments are still accepted
- does not read only resource files that have a locale in their
  file name. It reads all files in the xliffDir.
