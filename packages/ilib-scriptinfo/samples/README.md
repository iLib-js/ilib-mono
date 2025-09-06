# Sample Applications

This directory contains sample applications demonstrating different ways to use `ilib-scriptinfo` depending on your project's requirements.

## Available Samples

### 🚀 Modern ES Module Sample (`esm/`)

**Best for**: Modern projects using ES modules and latest JavaScript features

- **Module System**: ES Modules (`import`/`export`)
- **Node.js Version**: 14.0.0+
- **JavaScript Version**: ES2020+
- **Features**: `for...of`, `Array.includes()`, `import.meta.url`, template literals

```bash
cd samples/esm
pnpm install
node index.js Latn
```

### 🔧 Legacy CommonJS Sample (`legacy/`)

**Best for**: Projects requiring maximum compatibility with older Node.js versions

- **Module System**: CommonJS (`require`/`module.exports`)
- **Node.js Version**: 0.10.0+
- **JavaScript Version**: ES5
- **Features**: `var`, traditional `for` loops, string concatenation, `Array.indexOf()`

```bash
cd samples/legacy
pnpm install
node index.js Latn
```

## Quick Comparison

| Feature | Modern (`esm/`) | Legacy (`legacy/`) |
|---------|-----------------|-------------------|
| **Module System** | ES Modules | CommonJS |
| **Import Syntax** | `import scriptInfo from 'ilib-scriptinfo'` | `var scriptInfo = require('ilib-scriptinfo')` |
| **Node.js Version** | 14.0.0+ | 0.10.0+ |
| **Loop Style** | `for (const code of allScripts)` | `for (var i = 0; i < allScripts.length; i++)` |
| **Array Methods** | `code.includes(searchTerm)` | `code.indexOf(searchTerm) !== -1` |
| **Variables** | `const`/`let` | `var` |
| **Strings** | Template literals | String concatenation |
| **Main Detection** | `import.meta.url === \`file://\${process.argv[1]}\`` | `require.main === module` |

## Which Sample Should I Use?

### Choose Modern (`esm/`) if:
- ✅ You're using Node.js 14.0.0 or later
- ✅ You want to use ES modules
- ✅ You prefer modern JavaScript syntax
- ✅ You're building a new project
- ✅ You want the latest language features

### Choose Legacy (`legacy/`) if:
- ✅ You need to support Node.js 0.10.0 or earlier
- ✅ You're using CommonJS modules
- ✅ You're maintaining an existing project
- ✅ You prefer traditional JavaScript syntax
- ✅ You need maximum compatibility

## Both samples demonstrate:
- ✅ Script code lookup and validation
- ✅ Case-insensitive search
- ✅ Partial matching
- ✅ Error handling
- ✅ Help system
- ✅ Tabular output formatting

Choose the sample that best fits your project's requirements!
