# Sample Applications

This directory contains a sample application demonstrating how to use `ilib-scriptinfo` with TypeScript. Usage from plain Javascript (whether that is ES6 code or older ES5 code) is very similar.

This sample shows the core functionality of the ilib-scriptinfo library:

### Key Library Usage Examples

```typescript
import { scriptInfoFactory, ScriptInfo, ScriptDirection } from 'ilib-scriptinfo';

// Get script information using the factory function
const latin: ScriptInfo | undefined = scriptInfoFactory('Latn');
if (latin) {
    console.log(latin.name);           // "Latin"
    console.log(latin.scriptDirection); // ScriptDirection.LTR
    console.log(latin.casing);         // true (has upper/lowercase)
}

// Get all available scripts using the static method
const allScripts: string[] = ScriptInfo.getAllScripts();
console.log(`Total scripts: ${allScripts.length}`); // 226 scripts
```

### Running the Sample

```bash
cd samples/typescript
pnpm install
pnpm run:sample Latn
```

### What This Sample Demonstrates

- **Factory Function**: `scriptInfoFactory()` to create script info instances
- **Instance Properties**: Accessing script properties like name, direction, casing
- **Static Methods**: `ScriptInfo.getAllScripts()` to get all available scripts
- **Type Safety**: Full TypeScript support with IntelliSense
- **Error Handling**: Graceful handling of unknown script codes
- **Case Correction**: Automatic correction of script code casing

### Library Features Highlighted

- **Type Safety**: All methods are fully typed with IntelliSense support
- **Enum Support**: `ScriptDirection.LTR` and `ScriptDirection.RTL` enum values
- **Comprehensive Data**: Access to all 226 Unicode scripts
- **Script Properties**: Direction, casing, IME requirements, and more
- **Easy Integration**: Simple import and use in any TypeScript project

This sample focuses on demonstrating the library's core functionality rather than being a comprehensive application. The actual library usage is just a few lines of code! Extra utilities functions used in the index.ts are implemented in utils.ts, but they are not relevant as an example of the usage of this library.