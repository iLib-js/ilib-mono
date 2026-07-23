# ilib-lint-python-gnu

An ilib-lint plugin that provides the ability to check resources that come
from code written in python using the gnu gettext library.


## Installation

```
npm install --save-dev ilib-lint-python-gnu

or

yarn add --dev ilib-lint-python-gnu
```

Then, in your `ilib-lib-config.json`, add a script:

```
    "plugins": [
        "python-gnu"
    ],
```

Please note: nodejs version 14 or above is required to run ilib-lint, as it
is written with ESM modules.

## Parser

This plugin provides a class that can parse PO files and convert them into
resources. This class depends on the ilib-loctool-po plugin to do the heavy
lifting.

## Rules

The following rules apply to any resources from any file type, but are
designed to check resources that come from python code using the gnu gettext
library.

- resource-printf-params-match - check that any printf-style substitution
  parameters (like "%s" or "%d") that appear in the source string also appear
  in the target strings.
- resource-printf-params-numbered - check that if the source string contains more
  than one substitution parameter, then the parameters are properly numbered
  so that the translators can rearrange them as needed by the
  grammar of the target language.

## RuleSets

This plugin defines one ruleset `python-gnu` that will turn on all the rules
that this plugin supports. Users may rely on this ruleset when defining their
file types.

## License

Copyright © 2022-2024, 2026, JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-python-gnu/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-python-gnu/CHANGELOG.md).

