# ilib-loctool-strings

Ilib loctool plugin to parse and localize iOS .strings files

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.2.3

- update dependencies
- convert unit tests from nodeunit to jest

### v1.2.2

- update dependencies
- use the loctool's logger instead of its own

### v1.2.1

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.

### v1.2.0

- Added the ability to set the target locale for the file from the
  project settings if it is there. Otherwise, fall back to parsing
  the path name to find the locale.
- Fixed the way that flavors are detected in the path name