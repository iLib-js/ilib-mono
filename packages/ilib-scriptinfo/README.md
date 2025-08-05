# ilib-scriptinfo

Script information utilities for ilib. iLib is a cross-engine library of internationalization (i18n) classes written in pure JS.

## Features

- Get information about writing scripts (ISO 15924)
- Retrieve script properties like name, code number, direction, casing, and IME requirements
- Support for all 226 Unicode scripts
- Compact, efficient data representation
- Pure JavaScript with no external dependencies

## Installation

```bash
npm install ilib-scriptinfo
```

## Usage

```javascript
const ScriptInfo = require('ilib-scriptinfo');

// Create a script info instance
const scriptInfo = new ScriptInfo('Latn');

// Get script properties
console.log(scriptInfo.getCode());           // "Latn"
console.log(scriptInfo.getName());           // "Latin"
console.log(scriptInfo.getCodeNumber());     // 215
console.log(scriptInfo.getScriptDirection()); // "ltr"
console.log(scriptInfo.getCasing());         // true
console.log(scriptInfo.getNeedsIME());       // false

// Get all available scripts
const allScripts = ScriptInfo.getAllScripts();
console.log(allScripts.length); // 226
```

## API

### Constructor

```javascript
new ScriptInfo(script)
```

- `script` (string): The ISO 15924 4-letter identifier for the script

### Static Methods

- `ScriptInfo.getAllScripts()`: Returns an array of all available script identifiers.

### Instance Methods

- `getCode()`: Returns the 4-letter ISO 15924 identifier
- `getCodeNumber()`: Returns the ISO 15924 code number
- `getName()`: Returns the script name in English
- `getLongCode()`: Returns the long identifier
- `getScriptDirection()`: Returns "ltr", "rtl", or "ttb"
- `getCasing()`: Returns true if the script uses letter case
- `getNeedsIME()`: Returns true if the script typically requires an IME

## License

Copyright © 2013-2025 JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License. 