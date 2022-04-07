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

Logging
--------------------

Use the name "ilib-loader" to configure a log4js appender in your app to
see logging output from this library. If your app does not use log4js, that is
okay as well. The log4js output will just go to the bitbucket instead.

Using this Module in Webpack
--------------------

If you are using this module with your Webpacked application, Webpack will read and
chase down all dependencies and include them in the bundle. Unfortunately, since
this is a js-engine dependent module, some of the subclasses of Loader rely on
other modules that are not available and which cannot and should not be included
in the bundle. This causes errors when Webpack runs.

The solution is to declare that these unused dependencies are external. That is,
Webpack will assume that the environment that your app is running in will provide
these dependencies already. In our case, we won't actually provide the dependencies,
because we don't have to -- code that uses those dependencies will never run
because it is for a different engine.

Add the following to your webpack.config.js file:

```js
module.exports = {
    "externals": {
        "./NodeLoader": "NodeLoader",
        "./QtLoader": "QtLoader",
        "./RhinoLoader": "RhinoLoader",
        "./NashornLoader": "NashornLoader",
        "./RingoLoader": "RingoLoader",
        "log4js": "log4js"
    }
}
```

The last external, "log4js", should only be added if your app does not use log4js
already. If it does, then it will be in your Webpack bundle already, so you don't
have to pretend it is external.

In addition to preparing the externals, you should make sure to include all of
the ilib modules into the package. Fortunately, all of the ilib modules have names
that start with the prefix "ilib-" so they are easy to recognize:

```js
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: /node_modules\/ilib-/,
                ...
            }
        ]
    }
```

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

### v1.0.2

- use correct package name for the node fs packages for promises so that
  we don't use the polyfill all the time
- fix problem with missing variable declaration
- added some debugging output

### v1.0.1

- use the global scope to store class instances so that all copies
  of this library use the same class cache
- update dependencies
- add more to this README.md

### v1.0.0

- Initial version which only supports loading files on Nodejs. Later
  updates to this package will introduce support for webpack, Qt, etc.
