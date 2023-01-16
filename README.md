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

Copyright © 2022, JEDLSoft

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
