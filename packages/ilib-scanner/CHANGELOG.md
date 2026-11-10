# ilib-scanner

## 1.4.1

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.4.0

Fix ilib circular Dependency issue. new `classPath` option is added to explicitly specify the `ilib-unpack.js` file path.

## 1.3.2

Move ilib from devDependencies to dependencies.

## 1.3.1

Fix to include automatically non-gregorian CalendarDate when using DateFactory or JS Date Object.

## 1.3.0

Add support for webpack 4 by adding the "mode" setting. Default is 'development'.
