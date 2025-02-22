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

Copyright © 2024 JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

## Release Notes

See [CHANGELOG.md](./CHANGELOG.md)
