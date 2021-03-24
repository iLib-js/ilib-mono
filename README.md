# ilib-loctool-strings

Ilib loctool plugin to parse and localize iOS .strings files

## Release Notes

### v1.2.0

- Added the ability to set the target locale for the file from the
  project settings if it is there. Otherwise, fall back to parsing
  the path name to find the locale.
- Fixed the way that flavors are detected in the path name