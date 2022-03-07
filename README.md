# ilib-loader
Code to load data files

Situations

Node. Load locale files as local files directly and synchronously
Node. Load locale files as local files asynchronously

Webpack. Load locale data in bundles synchronously included in the package
Webpack. Load locale data in bundles asynchronously
qt
rhino
ringo
webos
enact
react

ES5 Sync, dynamic load
ES5 Async with callbacks

ES6 sync, dynamic load
ES6 Async, dynamic load with promises

Load locale files individually and asynchronously and return promises

import data from 'lib';

promise = data(name, locale)

API:

preload(locale)
setPath(array of paths) - path to search for files
loadData(non locale file)
loadDataAsync(non locale file)
load(locale file)
loadAsync(locale file)

Other concerns:

How to load data for your own component
How to glue data for multiple components together
    * each component should have a file that a packager can call to make
      a list of files to include in the locale package
    * ilib.data goes into ilib-common?
