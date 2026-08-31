# ilib-csv

Pure CSV/TSV parser and serializer. No file I/O; caller reads and writes files (matches ilib-po and ilib-xliff pattern).

## License

This package is licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for the full text.

## API

### CSV class

- **`new CSV(options)`** — Create instance with options (pathName, columnSeparator, etc.).
- **`parse(data: string)`** — Parse CSV text and return records.
- **`generate(records)`** — Generate CSV text from records.
- **`getPathName()`** — Return path name if set.

### Options

- `pathName` — Path (metadata; caller handles file I/O)
- `rowSeparator` / `rowSeparatorRegex` — Row separator for parsing (default: newline)
- `outputRowSeparator` — Row separator for output (default: `'\n'`)
- `columnSeparator` — Column separator (default: `','`)
- `headerRow` — Whether first row is header (default: `true`)
- `columns` — Column schema (inferred from header if not provided)

## Usage

```javascript
import fs from "fs";
import { CSV } from "ilib-csv";

// Parse
const csv = new CSV();
const data = fs.readFileSync("data.csv", "utf-8");
const records = csv.parse(data);

// Generate
const output = csv.generate(records);
fs.writeFileSync("output.csv", output, "utf-8");
```
