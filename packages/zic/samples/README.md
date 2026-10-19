# ilib-zic samples

Sample projects that demonstrate how to use the `ilib-zic` package.

## cli

Compiles a small bundled tzdata excerpt (`cli/data/`) into JSON zoneinfo.
The excerpt covers three zones from different regions:

- `America/New_York`
- `Europe/Paris`
- `Asia/Tokyo`

```
cd samples/cli
pnpm run:sample
```

Optional args override the default source and destination:

```
pnpm run:sample -- /path/to/tzdata /path/to/out
```
