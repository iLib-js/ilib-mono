# i18nlint-common

Common ilib-lint routines that the plugins will need.


## Installation

```
npm install i18nlint-common

or

yarn add i18nlint-common
```

This package is usually imported by the ilib-lint tool itself or plugins for
the ilib-lint tool.

## Full API Docs

See the [full API docs](./docs/i18nlint-common.md) for more information.

## License

Copyright © 2022-2023, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

## Release Notes

### v2.1.0

- added the FileStats class
- added fields to the Result object for the location of the issue

### v2.0.1

- fix a problem where you could not create a Result instance with a
  lineNumber equal to 0.

### v2.0.0

- added Parser.getType() method
- clarified some jsdocs
    - Rule.match() should return a Result instance, an array of
      Result instances, or undefined if no match
- added IntermediateRepresentation class to represent the results of
  parsing a file
- Parser.parse() should now return the intermediate representation
    - this requires the plugins to change, so the major version is bumped
- Added support for logging provided by the lint tool so that plugins
  can use the linter's logging
    - getLogger() function passed to the constructors

### v1.4.0

- added utility function withVisibleWhitespace() to visually represent whitespace characters
- added isKebabCase(), isSnakeCase(), and isCamelCase() utility functions

### v1.3.0

- added getLink() method to the Rule class

### v1.2.0

- update the plugin to return only classes, as the linter may need to instantiate
  the classes multiple times
- add the getRuleSets() method to the plugin to allow the plugins to define
  standard rule sets

### v1.1.0

- added methods to abstract classes needed for loading and testing the plugins

### v1.0.0

- initial version
- define initial code and default built-in rules
