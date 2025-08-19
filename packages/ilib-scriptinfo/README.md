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

```javascript
import ScriptInfo from 'ilib-scriptinfo';

// Get info about Latin script
const latin = new ScriptInfo('Latn');
console.log(latin.getName());           // "Latin"
console.log(latin.getDirection());      // "ltr" (left-to-right)
console.log(latin.getCasing());         // true (has upper/lowercase)

// Get info about Arabic script
const arabic = new ScriptInfo('Arab');
console.log(arabic.getName());          // "Arabic"
console.log(arabic.getDirection());     // "rtl" (right-to-left)
console.log(arabic.getCasing());        // false (no letter case)
```

## API

### Create a script info instance
```javascript
const script = new ScriptInfo('Latn');  // 4-letter ISO 15924 code
```

### Get script properties
- `getName()` - Script name in English
- `getDirection()` - "ltr" or "rtl" 
- `getCasing()` - Whether script uses letter case
- `getNeedsIME()` - Whether script typically needs input method editor
- `getCodeNumber()` - ISO 15924 numeric code

### Get all available scripts
```javascript
const allScripts = ScriptInfo.getAllScripts();
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