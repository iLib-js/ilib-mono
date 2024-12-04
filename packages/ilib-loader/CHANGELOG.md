# ilib-loader

## 1.3.3

-   Converted all unit tests from nodeunit to jest
-   Node 10 is no longer supported

## 1.3.2

-   This module is now a hybrid ESM/CommonJS package that actually works.
    It avoids much of the dual package hazard by explicitly storing the
    cache of registered loaders in the global scope and having no other
    package state.

## 1.3.1

-   Fixed incorrect documentation
-   removed useless polyfills which were causing code bloat

## 1.3.0

-   Now ships both the ES6 modules in the src directory and the commonjs code
    (transpiled with babel) in the lib directory. Callers can choose which one
    they would like to use.

## 1.2.0

-   added the ability to load JS files instead of just json files.
    -   if the file name extension is ".js", the node loader will use
        `require()` in sync mode and `import()` in async mode
    -   the webpack loader will always use `import()` as it only supports
        async mode
    -   the value returned is a module
        -   this may be an object, which may include a "default" property
            that contains a function to call to get the locale data
        -   for some modules (CommonJS), the module may be a function
            directly which can be called to get the locale data
-   Fix incorrect call to logger

## 1.1.1

-   the npm package for the previous version was built with the wrong babel target on
    a later version of node that didn't require most polyfills, so many things were not
    polyfilled properly for older node or older browsers

## 1.1.0

-   Add webpack loader subclass
-   Minimum version of node is now v10
-   Added babel configuration to polyfill Promise.allSettled on older versions of node
    or older browsers

## 1.0.3

-   add core-js to the dependencies so that this works properly as a package

## 1.0.2

-   use correct package name for the node fs packages for promises so that
    we don't use the polyfill all the time
-   fix problem with missing variable declaration
-   added some debugging output

## 1.0.1

-   use the global scope to store class instances so that all copies
    of this library use the same class cache
-   update dependencies
-   add more to this README.md

## 1.0.0

-   Initial version which only supports loading files on Nodejs. Later
    updates to this package will introduce support for webpack, Qt, etc.
