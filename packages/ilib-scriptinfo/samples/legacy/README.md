# Legacy Sample App

This sample demonstrates how to use `ilib-scriptinfo` with CommonJS and ES5 syntax for maximum compatibility with older Node.js versions and browsers.

## Features

- **CommonJS**: Uses `require()` instead of `import`
- **ES5**: Uses traditional JavaScript syntax for maximum compatibility
- **Node.js 0.10+**: Compatible with Node.js 0.10.0 and later
- **Legacy syntax**: Uses `var`, traditional `for` loops, string concatenation

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

### CommonJS Import
```javascript
var scriptInfoFactory = require('ilib-scriptinfo');
var ScriptInfo = scriptInfoFactory.ScriptInfo;
var ScriptDirection = scriptInfoFactory.ScriptDirection;
```

### ES5 Features Used
```javascript
// var declarations
var allScripts = ScriptInfo.getAllScripts();
var maxNameLength = 0;

// String concatenation
console.log('Script Information for "' + inputScriptCode + '"');

// Traditional for loops
for (var i = 0; i < allScripts.length; i++) {
    var code = allScripts[i];
    // ...
}

// Function declarations
function findCorrectCase(searchCode, allScripts) {
    // ...
}
```

### Legacy Compatibility
```javascript
// Traditional for loops instead of for...of
for (var i = 0; i < allScripts.length; i++) {
    var code = allScripts[i];
    // ...
}

// indexOf instead of includes
if (code.toLowerCase().indexOf(searchLower) !== -1) {
    // ...
}

// String concatenation instead of template literals
console.log('Found ' + matches.length + ' similar script code(s):');
```

## Comparison with Modern Sample

| Feature | Legacy Sample | Modern Sample |
|---------|---------------|---------------|
| Module System | CommonJS (`require`) | ES Modules (`import`) |
| Node.js Version | 0.10.0+ | 14.0.0+ |
| Syntax | ES5 | ES2020+ |
| File Extension | `.js` | `.js` (with `"type": "module"`) |
| Loop Style | Traditional `for` | `for...of` |
| Array Methods | `indexOf()` | `includes()` |
| Variables | `var` | `const`/`let` |
| Strings | Concatenation | Template literals |

This sample is perfect for projects that need to maintain compatibility with very old Node.js versions or prefer traditional JavaScript syntax.
