## Release Notes

### v1.0.9

- update dependencies
- now supports node v22

### v1.0.8

- can now deal with empty objects in the json

### v1.0.7

- update dependencies
- convert all unit tests from nodeunit to jest

### v1.0.6

- update dependencies

### v1.0.5

- added more explicit logging so that it is easier to debug loctool
  problems.
- now uses the loctool logger via the API instead of its own logging

### v1.0.4

- fixed a problem with paths that contain "." or ".." dir not being
  recognized as handled by this plugin
- Update dependencies
- minimum node version is now v10

### v1.0.3
- Add missing `tags` section to the defaults schema

### v1.0.2

- Add schema.json to bundled files in order to be available at NPM

### v1.0.1

- Fix errors while loading default schema, relative path was replaced
with an absolute.

### v1.0.0

- initial version
- includes default schema for OpenAPI files parsing
