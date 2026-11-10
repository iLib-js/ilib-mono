# ilib-loctool-php-resource

## 1.0.1

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 0.2.0

### Minor Changes

- d4b961b: Added new loctool plugin that can output php resource files.
  This plugin does not parse resource files. It is only for
  output.
