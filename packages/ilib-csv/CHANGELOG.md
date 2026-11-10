# ilib-csv

## 1.0.2

### Patch Changes

- 729c49e: Allow Node 24 and 26 by widening engines.node upper bound from <23 to <27.

  Yarn 1 enforces engines and refuses to install these packages on newer
  Node releases when the range stops at Node 23.

## 1.0.1

### Patch Changes

- c45373b: Parse quoted fields that contain newlines, and keep leading or trailing whitespace inside quotes so generate/parse round-trips.

## 1.0.0

### Major Changes

- 5e907d3: Introduce a new csv parser/generator library originally extracted from ilib-loctool-csv
