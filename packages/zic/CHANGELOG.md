# ilib-zic

## 0.0.0

### Minor Changes

- TypeScript port of the Java zic (zone info compiler) tool from
  monolithic ilib (`com.ilib.tools.zic`). Compiles IANA tzdata sources
  into JSON zoneinfo used by ilib, with a CLI (`ilib-zic <src> <dest>`)
  and programmatic `ZoneInfoCompiler` API. Published as `ilib-zic` because
  the npm name `zic` is already taken.
