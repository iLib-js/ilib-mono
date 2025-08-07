# ilib-scriptinfo

Script information utilities for ilib. iLib is a cross-engine library of internationalization (i18n) classes written in pure JS.

**Note**: This package was adapted from the original `ilib/js/lib/ScriptInfo.js` implementation and modernized with TypeScript support, enhanced testing, and improved documentation.

## Features

- **Script Information**: Get information about writing scripts (ISO 15924)
- **Script Properties**: Retrieve script properties like name, code number, direction, casing, and IME requirements
- **Complete Coverage**: Support for all 226 Unicode scripts
- **Compact Data**: Efficient data representation with optimized storage
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Modern JavaScript**: ES2019+ features with Node.js 12+ compatibility
- **Optional Chaining**: Clean code with `?.` and `??` operators
- **Dual Module Support**: Works with both CommonJS and ESM
- **Comprehensive Testing**: 34 tests covering edge cases and unknown scripts
- **Browser Support**: Karma testing for Chrome and Firefox
- **Zero Dependencies**: Pure JavaScript with no external runtime dependencies

## Technical Details

- **Source**: Adapted from original `ilib/js/lib/ScriptInfo.js` implementation
- **Build System**: Direct TypeScript compilation to CommonJS (no Babel/Grunt required)
- **Module Support**: Dual ESM/CommonJS support via package.json exports
- **Testing**: Jest for Node.js tests, Karma for browser tests
- **Documentation**: Comprehensive TSDoc comments and README.md
- **Data Sources**: `ucd-full` package for Unicode script data, `ilib` package for additional script properties

## Installation

```bash
npm install ilib-scriptinfo
```

## Usage

### CommonJS
```javascript
const { ScriptInfo, ScriptDirection } = require('ilib-scriptinfo');

// Create a script info instance
const scriptInfo = new ScriptInfo('Latn');

// Get script properties
console.log(scriptInfo.getCode());                    // "Latn"
console.log(scriptInfo.getName());                    // "Latin"
console.log(scriptInfo.getCodeNumber());              // 215
console.log(scriptInfo.getScriptDirection());         // ScriptDirection.LTR
console.log(scriptInfo.getCasing());                  // true
console.log(scriptInfo.getNeedsIME());                // false

// Get all available scripts
const allScripts = ScriptInfo.getAllScripts();
console.log(allScripts.length);                       // 226
```

### ESM/TypeScript
```typescript
import { ScriptInfo, ScriptDirection } from 'ilib-scriptinfo';

// Create a script info instance
const scriptInfo = new ScriptInfo('Latn');

// Get script properties
console.log(scriptInfo.getCode());                    // "Latn"
console.log(scriptInfo.getName());                    // "Latin"
console.log(scriptInfo.getCodeNumber());              // 215
console.log(scriptInfo.getScriptDirection());         // ScriptDirection.LTR
console.log(scriptInfo.getCasing());                  // true
console.log(scriptInfo.getNeedsIME());                // false

// Get all available scripts
const allScripts = ScriptInfo.getAllScripts();
console.log(allScripts.length);                       // 226
```

## API

### Constructor

```typescript
new ScriptInfo(script: string)
```

- `script` (string): The ISO 15924 4-letter identifier for the script

### Static Methods

- `ScriptInfo.getAllScripts(): string[]`: Returns an array of all available script identifiers.

### Instance Methods

- `getCode(): string`: Returns the 4-letter ISO 15924 identifier
- `getCodeNumber(): number | undefined`: Returns the ISO 15924 code number
- `getName(): string | undefined`: Returns the script name in English
- `getLongCode(): string | undefined`: Returns the long identifier
- `getScriptDirection(): ScriptDirection`: Returns `ScriptDirection.LTR` or `ScriptDirection.RTL`
- `getCasing(): boolean`: Returns true if the script uses letter case
- `getNeedsIME(): boolean`: Returns true if the script typically requires an IME

### Types

```typescript
enum ScriptDirection {
    LTR = "ltr",
    RTL = "rtl"
}
```

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