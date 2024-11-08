# ilib-loader

These are ilib classes that know how to load files in various platforms. The files can
be arbitrary files.

Usage
-----

First, create a loader instance using the LoaderFactory function. This loader
is a singleton so you only get one loader per run of your app. The type of the
loader that is created from the loader factory is dependent on the platform
as returned by the `getPlatform()` function in the `ilib-env` package.

To create a new loader from the factory:

```
import LoaderFactory from 'ilib-loader';

const loader = LoaderFactory();
```

Once you have the loader, you can use it to load single files. Without parameters,
the loadFile method defaults to asynchronous mode and returns a Promise. With
the sync option in the options parameter, you can specify to load the file
synchronously. In this case, the contents of the file will be returned directly
from the method.

Examples:

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

Alternately, you can load an array of files all at once by passing in an
array of file names:

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

Files with a ".js", ".cjs", or ".mjs" extension will be treated as
a Javascript file. It will be loaded as code, and the module will be returned
to the caller as a module. The path name should be relative to the current
directory of the app, not relative to the module that is calling the
`loadFiles` method.

Files with the extension ".mjs" will be interpretted as ES modules, and as
such they can only be loaded asynchronously. If you attempt to load it
synchronously, the `loadFile` method will return undefined for that file.

Files with the extension ".js" and ".cjs" will be interpretted as CommonJS
files and can be loaded synchronously or asynchronously. As such, if you
put any ESM code into a ".js" file, it will be a syntax error and `loadFiles`
will return undefined for that file in both synchronous and asychronous modes.

For other file extensions, no assumptions are made about the contents
of the files other than these:

- the file is a text file
- the text is encoded in UTF-8

Specifically, no assumption is made as to the format of the file, making it equally
possible to load json files, csv files, or yaml files. The contents are returned
as a string, and it is up to the caller to interpret the format of that string
with the appropriate parser.

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

### Unnecessary Loader Subclasses

If you are using this module with your Webpacked application, Webpack will read and
chase down all dependencies and include them in the bundle, including all of the
subclasses of Loader intended for other platforms. Unfortunately, since
this package is a js-engine dependent module, some of the subclasses of Loader rely on
modules and code which are not available in a browser. These subclasses cannot therefore
be included in your app's webpack bundle.

The solution is to declare that these Loader subclasses are external. That is,
Webpack will assume that the environment that your app is running in will provide
these dependencies already so it doesn't need to include them. In our case, we won't
actually provide those dependencies, because we don't have to -- code that uses those
dependencies will never run because it is only used on other platforms. The only loader
subclass we really need is the one for webpack.

Add the following to your webpack.config.js file:

```js
module.exports = {
    "externals": {
        "./NodeLoader.js": "NodeLoader",
        "./QtLoader.js": "QtLoader",
        "./RhinoLoader.js": "RhinoLoader",
        "./NashornLoader.js": "NashornLoader",
        "./RingoLoader.js": "RingoLoader",
        "log4js": "log4js"
    }
}
```

The last external, "log4js", should only be added if your app does not use log4js
already. If it does, then it will be in your Webpack bundle already, so you don't
have to pretend it is external.

### Including Ilib Classes

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
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [[
                            '@babel/preset-env',
                            {
                                useBuiltIns: 'usage',
                                corejs: {
                                    version: 3,
                                    proposals: true
                                }
                            }
                        ]],
                        plugins: [
                            //"add-module-exports",
                            "@babel/plugin-transform-regenerator"
                        ]
                    }
                }
            }
        ]
    }
```

### Point Webpack to Your Data Files

Finally, the files containing locale data for ilib classes or containing the translations
of strings extracted from your app should be assembled using [ilib-assemble](https://github.com/iLib-js/ilib-assemble)
into individual files per locale.
These files should go into a directory inside your app and the name of that directory
should go into a resolve alias called "calling-module" in your webpack configuration:

```js
    resolve: {
        alias: {
            "calling-module": "<your directory here>"
        }
    }
```

The webpack loader uses this alias to locate the data files so that it can include them into
the webpacked bundle. The webpack loader will create a chunk for each
of the files it finds in this directory. In this way, you are not loading the data for all
locales into memory at the same time when the bundle is loaded. It will dynamically load
only the locale data needed for the locales that are being used.

## License

Copyright © 2022-2023, JEDLSoft

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

### v1.3.3

* Converted all unit tests from nodeunit to jest
* Node 10 is no longer supported

### v1.3.2

* This module is now a hybrid ESM/CommonJS package that actually works.
  It avoids much of the dual package hazard by explicitly storing the
  cache of registered loaders in the global scope and having no other
  package state.

### v1.3.1

* Fixed incorrect documentation
* removed useless polyfills which were causing code bloat

### v1.3.0

* Now ships both the ES6 modules in the src directory and the commonjs code
  (transpiled with babel) in the lib directory. Callers can choose which one
  they would like to use.

### v1.2.0

- added the ability to load JS files instead of just json files.
    - if the file name extension is ".js", the node loader will use
      `require()` in sync mode and `import()` in async mode
    - the webpack loader will always use `import()` as it only supports
      async mode
    - the value returned is a module
        - this may be an object, which may include a "default" property
          that contains a function to call to get the locale data
        - for some modules (CommonJS), the module may be a function
          directly which can be called to get the locale data
- Fix incorrect call to logger

### v1.1.1

- the npm package for the previous version was built with the wrong babel target on
  a later version of node that didn't require most polyfills, so many things were not
  polyfilled properly for older node or older browsers

### v1.1.0

- Add webpack loader subclass
- Minimum version of node is now v10
- Added babel configuration to polyfill Promise.allSettled on older versions of node
  or older browsers

### v1.0.3

- add core-js to the dependencies so that this works properly as a package

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
