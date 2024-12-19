# ilib-es6

ES6 wrappers around the ilib classes so that you can import just what you need and use
the classes with promises.

Usage
-----

All classes that ilib contains are echoed here in ilib-es6. You may use these as you
had before with the exact same API. However, there are a few additional methods and
other differences.

Including Classes
-----------------

With ilib-es6, you import classes instead of requiring them.

old syntax with regular ilib:

```
var AddressFmt = require("ilib/lib/AddressFmt.js");
```

(This old syntax is still supported, though.)

new syntax with ilib-es6:

```
import { AddressFmt } from 'ilib-es6';
```


Asynchronous Calls Using Promises
--------------

When calling classes asynchronously, you can continue to use callbacks as before or
you can use the promises returned from the _create_ factory method.

old async call using callbacks:

```javascript
var AddressFmt = require("ilib/lib/AddressFmt.js");

new AddressFmt({
  sync: false,
  onLoad: function(af) {
    // format some addresses using the af formatter
  }
});
```

new async calls using promises:

```javascript
import { AddressFmt } from "ilib-es6";

AddressFmt.create().then(af => {
  // format some addresses using the af formatter
});
```

Note that you can still use either method above. Both are still supported.

Promises with Parameters
-------------

The _create_ factory method takes the same parameters that the class's constructor takes. For example,
to create an address formatter in Switzerland with French, you would do:

```javascript
import { AddressFmt } from "ilib-es6";

AddressFmt.create({
  locale: "fr-CH"
}).then(af => {
  // format some Swiss addresses using the af formatter
});
```

Note that you do not need to pass the _sync_ or _onLoad_ parameters to the _create_ factory method. Calling
the create factory method implies asynchronous mode using promises instead of callbacks.

Asynchronous Methods
-------------

Promises are also supported for some class methods that are asynchronous as well.
Example:

```javascript
import { AddressFmt } from "ilib-es6";

AddressFmt.create().then(af => {
  // false for "asynchronous". getFormatInfo returns a promise as well.
  return af.getFormatInfo("en-US", false);
}).then(info => {
  // use the info here to create an address input form
});
```

Synchronous Classes
-----------

You can continue using ilib classes synchronously as you had before.

old:

```javascript
var AddressFmt = require("ilib/lib/AddressFmt.js");

var af = new AddressFmt();
// now format some addresses using the af formatter
```

new:

```javascript
import { AddressFmt } from "ilib-es6";

const af = new AddressFmt();
// now format some addresses using the af formatter
```

When a class is used synchronously, the constructor
returns an instance of the class. When an instance of the same class is
constructed asynchronously with sync: false, the constructor returns an empty
default instance and calls the callback function given in the onLoad property
when all of the locale data is finished loading.

Using Factories
---------------

Factory functions in ilib now have two types: a regular version that returns an
instance of the class, and the asynchronous-only version that returns a promise.
The async version of the factory always has an "Async" suffix at the end of its name.

Synchronous:

```javascript
import { CalendarFactory } from 'ilib-es6';

let cal = CalendarFactory({locale: 'ja-JP'});
// do something with the new cal calendar.
```

Asynchronous:

```javascript
import { CalendarFactoryAsync } from 'ilib-es6';


CalendarFactoryAsync({locale: 'ja-JP'}).then(function(cal) {
  // do something with the new cal calendar.
});
```

## License

Copyright © 2019-2024, JEDLSoft

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

See the License for the specific language governing permissions and
limitations under the License.

Versions
--------

Starting with version 14.2.0, the version of ilib-es6 will echo the version of ilib
that it goes with. Earlier than that, version 2.0.0 of ilib-es6 went with ilib versions
14.0.0 to 14.1.2.

You should not use ilib-es6 with ilib 13.X and earlier, as the async support in ilib
didn't work in all cases. Although many of the async calls did work in 13.X, a few
important ones did not. (For example, there were missing callbacks, some classes were
missing async mode, some static methods were not able to be called asynchronously,
and in some cases, it was calling the callback before the async call was done, etc.)
These problems were all fixed and tested in 14.X, so it is highly recommended to use
14.X versions of ilib with ilib-es6.

As of v14.15.0, ilib-es6 will no longer have transpiled sources in it will be listed
as an ESM-only project in its package.json. If you need commonjs sources, use ilib
directly. Because of this, this package will no longer work on node versions less
than 12.
