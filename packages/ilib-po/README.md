# ilib-po

A parser and generator for GNU po format files

## API Documentation

Full API documentation can be found [here](./docs/index.md).
HTML version can be found [here](./docs/index.html).

## Quick Start

Parsing a file in PO format:

```javascript
import fs from 'fs';
import { POFile } from 'ilib-po';

let po = new POFile();
const data: string = fs.readFileSync('path/to/po/file.po', 'utf-8');
const translationSet = po.parse(data);

// resources is now an array of all the resources in the PO file
const resources: Resource[] = translationSet.getAll();
```

Generating a file in PO format:

```javascript
import fs from 'fs';
import { TranslationSet, ResourceString } from 'ilib-tools-common';
import { POFile } from 'ilib-po';

const po = new POFile();
const translationSet = new TranslationSet();
const res = new ResourceString({
    sourceLocale: 'en-US',
    targetLocale: 'fr-FR',
    datatype: 'x-json',
    key: 'hello',
    source: 'Hello, world!',
    target: 'Bonjour, le monde!'
});
translationSet.add(res);
const data: string = po.generate(translationSet);
// data now contains the contents of the PO file

fs.writeFileSync('path/to/output/file.po', data, 'utf-8');
```

Make sure to use UTF-8 encoding when reading and writing PO files as they can contain Unicode characters
in the translated files.

## License

Copyright © 2024, 2026 JEDLSoft

This package is released under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). The full license text is available in the [LICENSE](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-po/LICENSE) file in the ilib-mono repository on GitHub.

## Release Notes

See [CHANGELOG.md](https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-po/CHANGELOG.md).

