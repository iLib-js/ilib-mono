# Modern ES Module Sample App

This sample demonstrates how to use `ilib-scriptinfo` with modern ES modules and ES2020+ syntax.

## Features

- **ES Modules**: Uses `import` instead of `require`
- **Modern JavaScript**: Uses ES2020+ features like `for...of`, `Array.includes()`, etc.
- **Node.js 14+**: Requires Node.js 14.0.0 or later for ES module support
- **TypeScript-ready**: Compatible with TypeScript and modern build tools

## Usage

```bash
# Install dependencies
npm install

# Run the sample
node index.js Latn
node index.js Arab
node index.js --help
```

## Code Examples

### ES Module Import
```javascript
import scriptInfoFactory, { ScriptInfo, ScriptDirection } from 'ilib-scriptinfo';
```

### Modern JavaScript Features
```javascript
// for...of loops
for (const code of allScripts) {
    // ...
}

// Array methods
if (code.toLowerCase().includes(searchLower)) {
    // ...
}

// Template literals
console.log(`Script Information for "${inputScriptCode}"`);

// Destructuring
const { stdout, stderr } = await execFileAsync("node", [sampleAppPath, ...args]);
```

### Modern Module Detection
```javascript
// ES module main detection
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
```

## Comparison with Legacy Sample

| Feature | Modern Sample | Legacy Sample |
|---------|---------------|---------------|
| Module System | ES Modules (`import`) | CommonJS (`require`) |
| Node.js Version | 14.0.0+ | 12.0.0+ |
| Syntax | ES2020+ | ES2015 |
| File Extension | `.js` (with `"type": "module"`) | `.js` |
| Loop Style | `for...of` | Traditional `for` |
| Array Methods | `includes()` | `indexOf()` |

This sample is perfect for modern projects that want to use the latest JavaScript features and ES modules.