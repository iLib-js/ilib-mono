# ilib-scriptinfo Sample App

A simple command-line example showing how to use the `ScriptInfo` class from the `ilib-scriptinfo` package.

## Quick Start

```bash
# Run with a script code
node index.js latn

# Show help
node index.js --help
```

## What It Shows

This sample demonstrates the core `ScriptInfo` API:

```javascript
import ScriptInfo, { ScriptDirection } from 'ilib-scriptinfo';

// Create instance and get properties
const script = new ScriptInfo('Latn');
console.log(script.getName());           // "Latin"
console.log(script.getCodeNumber());     // 215
console.log(script.getScriptDirection()); // "ltr"

// Check script characteristics
console.log(script.getNeedsIME());       // false
console.log(script.getCasing());         // true

// Get all available scripts
const allScripts = ScriptInfo.getAllScripts();
```

## Example Output

```
Script Information for "latn"
==================================================
Code             | Latn
Code Number      | 215
Name             | Latin
Script Direction | 📝 LTR Left-to-Right
IME Requirement  | ⌨️  No IME required
Casing Info      | 🔤 Uses letter case
==================================================
```

## Try These Script Codes

- `Latn` - Latin
- `Arab` - Arabic  
- `Hani` - Chinese Han
- `Deva` - Devanagari
- `Cyrl` - Cyrillic

The app handles partial matches and case correction automatically.
