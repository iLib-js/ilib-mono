# ilib-lint-box

An ilib-lint plugin that provides rules and rulesets for Box
projects.


## Installation

```
npm install --save-dev ilib-lint-box

or

yarn add --dev ilib-lint-box
```

Then, in your `ilib-lib-config.json`, add a script:

```
    "plugins": [
        "ilib-lint-box"
    ],
```

Please note: nodejs version 14 or above is required to run ilib-lint, as it
is written with ESM modules.

## Rules

The following rules apply to any resources from any file type, but are
designed to check resources:

- resource-box-php-param-match check that any PHP-style substitutions match in
  the source and target. These are similar to printf-style parameters but
  only use numbers. eg. "%1 and %2"

## RuleSets

This plugin defines the following rulesets:

- box-php

## License

Copyright © 2025, JEDLSoft

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

See [CHANGELOG.md](./CHANGELOG.md)
