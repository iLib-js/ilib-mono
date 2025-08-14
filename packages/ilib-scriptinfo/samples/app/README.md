# ilib-scriptinfo Sample App

This is a sample command-line application that demonstrates how to use the `ilib-scriptinfo` package to look up information about writing scripts based on ISO 15924 codes.

## Features

- Look up script information by ISO 15924 4-letter code
- Display all script properties in a tabular format
- Show additional contextual information about the script
- Provide helpful error messages for unknown script codes
- **Smart partial matching**: Search for similar script codes when exact match not found
- **Case correction**: Automatically corrects case in table output (e.g., "latn" shows as "Latn")
- List example script codes when an invalid code is provided
- Built-in help system with `--help` or `-h` flags

## Installation

```bash
# Navigate to the sample app directory
cd packages/ilib-scriptinfo/samples/app

# Install dependencies
npm install
```

## Usage

```bash
# Run the sample app with a script code
node index.js <script-code>

# Show help information
node index.js --help
node index.js -h
```

## Examples

### Show Help
```bash
node index.js --help
```

### Latin Script (with case correction)
```bash
node index.js latn
```

Output:
```
Script Information for "latn"
==================================================
Code             | Latn
Code Number      | 215
Name             | Latin
Long Code        | Latin
Script Direction | ltr
Needs IME        | false
Uses Casing      | true
==================================================

✅ Valid script found: Latin
📝 Writing direction: Left-to-Right
🔤 This script uses letter case (uppercase/lowercase)
```

### Arabic Script (with case correction)
```bash
node index.js arab
```

Output:
```
Script Information for "arab"
==================================================
Code             | Arab
Code Number      | 160
Name             | Arabic
Long Code        | Arabic
Script Direction | rtl
Needs IME        | false
Uses Casing      | false
==================================================

✅ Valid script found: Arabic
📝 Writing direction: Right-to-Left
🔤 This script does not use letter case
```

### Partial Matching Examples

The app includes smart partial matching that searches for similar script codes when an exact match isn't found:

#### Partial Code Match
```bash
node index.js lat
```

Output:
```
❌ Unknown script code: "lat"
🔍 Found 4 similar script code(s):
   Hntl - Han (Traditional variant) with Latin (alias for Hant + Latn)
   Latf - Latin (Fraktur variant)
   Latg - Latin (Gaelic variant)
   Latn - Latin
```

#### Script Name Match
```bash
node index.js han
```

Output:
```
❌ Unknown script code: "han"
🔍 Found 12 similar script code(s):
   Dupl - Duployan shorthand, Duployan stenography
   Hang - Hangul (Hangŭl, Hangeul)
   Hani - Han (Hanzi, Kanji, Hanja)
   Hano - Hanunoo (Hanunóo)
   Hans - Han (Simplified variant)
   Hant - Han (Traditional variant)
   Hntl - Han (Traditional variant) with Latin (alias for Hant + Latn)
   Jamo - Jamo (alias for Jamo subset of Hangul)
   Jpan - Japanese (alias for Han + Hiragana + Katakana)
   Kore - Korean (alias for Hangul + Han)
   Rohg - Hanifi Rohingya
```

#### Single Match Suggestion
```bash
node index.js latn
```

Output:
```
❌ Unknown script code: "latn"
🔍 Found 2 similar script code(s):
   Hntl - Han (Traditional variant) with Latin (alias for Hant + Latn)
   Latn - Latin

💡 Did you mean: Latn?
```

#### No Matches Found
```bash
node index.js xyz
```

Output:
```
❌ Unknown script code: "xyz"
💡 No similar script codes found for "xyz"
💡 Try one of these valid script codes:
   Adlm - Adlam
   Afak - Afaka
   Aghb - Caucasian Albanian
   Ahom - Ahom, Tai Ahom
   Arab - Arabic
   Aran - Arabic (Nastaliq variant)
   Armi - Imperial Aramaic
   Armn - Armenian
   Avst - Avestan
   Bali - Balinese
   ... and 216 more scripts
```

### Chinese Han Script
```bash
node index.js Hani
```

Output:
```
Script Information for "Hani"
==================================================
Code             | Hani
Code Number      | 500
Name             | Han (Hanzi, Kanji, Hanja)
Long Code        | Han
Script Direction | ltr
Needs IME        | true
Uses Casing      | false
==================================================

✅ Valid script found: Han (Hanzi, Kanji, Hanja)
📝 Writing direction: Left-to-Right
⌨️  This script typically requires an Input Method Editor (IME)
🔤 This script does not use letter case
```

## Available Script Properties

The sample app displays the following properties for each script:

- **Code**: The ISO 15924 4-letter script code (corrected to proper case)
- **Code Number**: The ISO 15924 numeric code
- **Name**: The English name of the script
- **Long Code**: The long identifier for the script
- **Script Direction**: Writing direction (ltr = left-to-right, rtl = right-to-left)
- **Needs IME**: Whether the script typically requires an Input Method Editor
- **Uses Casing**: Whether the script uses letter case (uppercase/lowercase)

## Smart Partial Matching

When an unknown script code is provided, the app searches for similar matches using:

1. **Code matching**: Searches for script codes that contain the input (case-insensitive)
2. **Name matching**: Searches for script names that contain the input (case-insensitive)
3. **Single match suggestion**: If exactly one match is found, suggests "Did you mean?"
4. **Fallback**: If no matches are found, shows example script codes

This helps users find the correct script code even if they:
- Make typos (e.g., "lat" instead of "Latn")
- Use partial codes (e.g., "arab" instead of "Arab")
- Search by script name (e.g., "han" to find "Hani")
- Use lowercase instead of proper case

## Case Correction

The app automatically corrects the case of script codes in the table output:

- **Input**: `latn` → **Output**: `Latn`
- **Input**: `LATN` → **Output**: `Latn`
- **Input**: `arab` → **Output**: `Arab`
- **Input**: `ARAB` → **Output**: `Arab`

This ensures that users always see the correct ISO 15924 format regardless of how they input the script code.

## Implementation Details

The sample app demonstrates how to use the `ilib-scriptinfo` package:

```javascript
import { ScriptInfo, ScriptDirection } from 'ilib-scriptinfo';

// Create a ScriptInfo instance
const scriptInfo = new ScriptInfo('Latn');

// Access script properties
console.log(scriptInfo.getCode());        // "Latn"
console.log(scriptInfo.getName());        // "Latin"
console.log(scriptInfo.getCodeNumber());  // 215
console.log(scriptInfo.getScriptDirection()); // "ltr"
console.log(scriptInfo.getNeedsIME());    // false
console.log(scriptInfo.getCasing());      // true

// Get all available script codes
const allScripts = ScriptInfo.getAllScripts();
```

## Command-Line Options

- `--help` or `-h`: Show detailed help information including usage, examples, and common script codes
- No arguments: Shows help information (same as `--help`)

## Development

```bash
# Run the app
npm start

# Test with Latin script
npm test

# Show help
node index.js --help
```

## Common Script Codes

Here are some commonly used script codes you can try:

- `Latn` - Latin
- `Arab` - Arabic
- `Hani` - Han (Chinese)
- `Deva` - Devanagari
- `Cyrl` - Cyrillic
- `Grek` - Greek
- `Hebr` - Hebrew
- `Thai` - Thai
- `Hang` - Hangul (Korean)
- `Kana` - Katakana
- `Hira` - Hiragana

For a complete list of all available script codes, you can modify the sample app to call `ScriptInfo.getAllScripts()` or run the app with an unknown script code to see examples. 