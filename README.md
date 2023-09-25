# ilib-loctool-properties

Ilib loctool plugin to parse and localize Java properties files in the traditional format.
If you need an xml-style properties file, use ilib-loctool-properties-xml instead.

## License

This plugin is license under Apache2. See the [LICENSE](./LICENSE)
file for more details.

## Release Notes

### v1.0.4

- update dependencies
- convert unit tests from nodeunit to jest

### v1.0.3

- update dependencies
- use the loctool's logger instead of its own

### v1.0.2

- Fix a bug where the pseudo locales were not initialized properly.
  This fix gets the right set of locales from the project settings to
  see if any of them are pseudo locales.

## v1.0.1

- Fixed some broken unit tests and updated some dependencies, but 
otherwise no major code changes
