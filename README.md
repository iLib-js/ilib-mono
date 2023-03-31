# ilib-lint-javascript

An ilib-lint plugin that provides the ability to parse javascript files and 
provides rules to check resources that come from code written in javascript.


## Installation

```
npm install --save-dev ilib-lint-javascript

or

yarn add --dev ilib-lint-javascript
```

Then, in your `ilib-lib-config.json`, add a script:

```
    "plugins": [
        "javascript"
    ],
```

Please note: nodejs version 14 or above is required to run ilib-lint, as it
is written with ESM modules.

## Rules

The following rules apply to any resources from any file type, but are
designed to check resources that come from javascript code:

- resource-javascript-params-match - check that any javascript-style substitution
  parameters (like "{name}") that appear in the source string also appear in the 
  target strings.
- resource-javascript-legacy-match - check that any legacy javascript-style substitution
  parameters (like "%(name)s" or "%(name)d") that appear in the source string
  also appear in the target strings.
- resource-javascript-template-match - check that any Template class-style substitution
  parameters (like "$name" or "$age") that appear in the source string
  also appear in the target strings.

## RuleSets

This plugin defines one ruleset `javascript` that will turn on all the rules
that this plugin supports. Users may rely on this ruleset when defining their
file types.

## License

Copyright © 2023, JEDLSoft

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

### v1.0.0

- initial version
- Rules for javascript resources
