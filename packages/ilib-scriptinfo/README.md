# ilib-scriptinfo

Get information about writing scripts (ISO 15924) for internationalization. The data is derived from the Unicode project, which maintains the ISO 15924 standard for script identification. Supports all 226 Unicode scripts with properties like direction, casing, and IME requirements.

## What it does

- **Script Information**: Get details about any writing script (Latin, Arabic, Chinese, etc.)
- **Script Properties**: Direction (left-to-right vs right-to-left), letter casing, IME needs
- **Complete Coverage**: All 226 Unicode scripts supported
- **Easy to Use**: Simple API with TypeScript support

## Installation

```bash
npm install ilib-scriptinfo
```

## Quick Start

### TypeScript
```typescript
import { scriptInfoFactory, ScriptDirection, ScriptInfo } from 'ilib-scriptinfo';

// Get info about Latin script
const latin: ScriptInfo | undefined = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.name);           // "Latin"
    console.log(latin.scriptDirection); // ScriptDirection.LTR
    console.log(latin.casing);         // true (has upper/lowercase)
}
```

### ES Modules (ESM)
```javascript
import { scriptInfoFactory, ScriptDirection } from 'ilib-scriptinfo';

// Get info about Latin script
const latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.name);           // "Latin"
    console.log(latin.scriptDirection); // ScriptDirection.LTR
    console.log(latin.casing);         // true (has upper/lowercase)
}

// Get info about Arabic script
const arabic = scriptInfoFactory('Arab');
if (arabic) {
    console.log(arabic.name);          // "Arabic"
    console.log(arabic.scriptDirection); // ScriptDirection.RTL
    console.log(arabic.casing);        // false (no letter case)
}
```

### CommonJS (Legacy ES5)
```javascript
var scriptInfoFactory = require('ilib-scriptinfo').scriptInfoFactory;
var ScriptDirection = require('ilib-scriptinfo').ScriptDirection;

// Get info about Latin script
var latin = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.name);           // "Latin"
    console.log(latin.scriptDirection); // ScriptDirection.LTR
    console.log(latin.casing);         // true (has upper/lowercase)
}
```

## API

### Create a script info instance
```typescript
// TypeScript
import { scriptInfoFactory, ScriptInfo } from 'ilib-scriptinfo';
const script: ScriptInfo | undefined = scriptInfoFactory('Latn');
```

```javascript
// ESM
import { scriptInfoFactory } from 'ilib-scriptinfo';
const script = scriptInfoFactory('Latn');  // 4-letter ISO 15924 code

// CommonJS (ES5)
var scriptInfoFactory = require('ilib-scriptinfo').scriptInfoFactory;
var script = scriptInfoFactory('Latn');  // 4-letter ISO 15924 code
// Returns ScriptInfo instance or undefined if script not found
```

### Get script properties
- `name` - Script name in English
- `scriptDirection` - ScriptDirection.LTR or ScriptDirection.RTL 
- `casing` - Whether script uses letter case
- `needsIME` - Whether script typically needs input method editor
- `codeNumber` - ISO 15924 numeric code
- `code` - ISO 15924 4-letter code
- `longCode` - Long identifier for the script

### Get all available scripts
```typescript
// TypeScript
import { ScriptInfo } from 'ilib-scriptinfo';
const allScripts: string[] = ScriptInfo.getAllScripts();
```

```javascript
// ESM
import { ScriptInfo } from 'ilib-scriptinfo';
const allScripts = ScriptInfo.getAllScripts();

// CommonJS (ES5)
var ScriptInfo = require('ilib-scriptinfo').ScriptInfo;
var allScripts = ScriptInfo.getAllScripts();
// Returns array of all 226 script codes
```

## Common Script Codes

- `Latn` - Latin (English, Spanish, French, etc.)
- `Arab` - Arabic
- `Hans` - Chinese Simplified
- `Hant` - Chinese Traditional
- `Cyrl` - Cyrillic (Russian, Bulgarian, etc.)
- `Deva` - Devanagari (Hindi, Marathi, etc.)
- `Grek` - Greek
- `Hira` - Hiragana (Japanese)
- `Kana` - Katakana (Japanese)
- `Hang` - Hangul (Korean)
- `Thai` - Thai

## Documentation

For detailed API documentation including all available methods and types, see the extracted [TypeScript documentation](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-scriptinfo/docs/index.html).

## License

Copyright © 2025 JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License. 