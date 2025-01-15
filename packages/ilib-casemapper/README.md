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
