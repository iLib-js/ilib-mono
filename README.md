# ilib-loader

These are ilib classes that know how to load file in various platforms. The files can
be arbitrary files.

Usage
-----

You start out by create a loader instance using the LoaderFactory function. This loader
is a singleton so you only get one loader per run. The type of the loader that is
created from the loader factory is dependent on the platform given by the
`getPlatform()` function in the `ilib-env` package.

Creating a new loader from the factory:

```
import LoaderFactory from 'ilib-loader';

const loader = LoaderFactory();
```

Once you have the loader, you can use it to load single files:

```
import LoaderFactory from 'ilib-loader';

const loader = LoaderFactory();

// asynchronous usage
loader.loadFile("pathname").then((content) => {
    // use the content here
});

// synchronous usage
const content = loader.loadFile("pathname", { sync: true });
```

or an array of files all at once:

```
import LoaderFactory from 'ilib-loader';

const loader = LoaderFactory();

// asynchronous usage
loader.loadFiles(["path1", "path2", "path3"]).then((content) => {
    // content is:
    // [
    //    "content of path1",
    //    "content of path2",
    //    "content of path3"
    // ]
});

// synchronous usage:
const content = loader.loadFile(["path1", "path2", "path3"], { sync: true });
// content is:
// [
//    "content of path1",
//    "content of path2",
//    "content of path3"
// ]
```

Files Not Found
-----------------

If the caller gives a file name for a file that does not exist, there is no
exception thrown. Instead, an undefined value will be returned. For asynchronous
calls, the promise will resolve to an undefined value.

Example:

```
import LoaderFactory from 'ilib-loader';

const loader = LoaderFactory();

loader.loadFiles(["path1", "non-existent-file", "path3"]).then((content) => {
    // content is:
    // [
    //    "content of path1",
    //    undefined,
    //    "content of path3"
    // ]
});
```

Assumptions About the Loaded Files
-------------------

No assumptions are made about the contents of the files other than these:

- the file is a text file
- the text is encoded in UTF-8

Specifically, no assumption is made as to the format of the file, making it equally
possible to load json files as well as yaml files.

Full JS Docs
--------------------

Full API documentation can be found [here](./docs/ilib-loader.md).

## License

Copyright © 2022, JEDLSoft

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

### v1.0.0

- Initial version which only supports loading files on Nodejs. Later
  updates to this package will introduce support for webpack, Qt, etc.
