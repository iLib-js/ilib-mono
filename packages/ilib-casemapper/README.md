# ilib-casemapper

Map a string to upper- or lower-case locale-sensitively.

Many people don't realize that case mapping is a locale-sensitive
operation. The fact is, what the upper-case version of a particular letter
is depends on who you ask!

## Installation

```sh
npm install ilib-casemapper
# or
yarn add ilib-casemapper
```

## Upper- or Lower-casing a Letter

To map the case of a letter, you first create an instance of the CaseMapper
class. By default, this will use the mappings for English.

Here is how you would map a letter using the Turkish rules:

```javascript
// ES5
var CaseMapper = require("ilib-casemapper");
var cm = new CaseMapper({ locale: "tr-TR" });

var upper = cm.map("i"); // "upper" should now contain "İ"

// ES6
import CaseMapper from "ilib-casemapper";
const cm = new CaseMapper({ locale: "tr-TR" });

const upper = cm.map("i"); // "upper" should now contain "İ"
```

In general, you should be able to use the case mapper in older Javascript
engines by requiring it, or in modern Javascript engines by
importing it. The package was built to be able to support both. From here
on, we will only give modern JS examples.

Here is how you use the case mapper to lower:

```javascript
import CaseMapper from "ilib-casemapper";
const cm = new CaseMapper({
  locale: "tr-TR",
  direction: "lower"
});

const upper = cm.map("İ"); // "upper" should now contain "i"
```

Full documentation: [CaseMapper class](./docs/CaseMapper.md)

## License

Copyright © 2025-2026, JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-casemapper/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-casemapper/CHANGELOG.md).

