# ilib-zic samples

Sample projects that demonstrate how to use the `ilib-zic` package.

## cli

Runs the full pipeline (compile → enrich → write) on a small bundled tzdata
excerpt (`cli/data/`) into `cli/locale/`:

- `zoneinfo/<Continent>/<City>.json` (with country `c` and Windows name `n`)
- `zoneinfo/zonetab.json`
- `timezone.jf` and `und/<CC>/timezone.jf`

Zones in the excerpt:

- `America/New_York` (`E%sT`)
- `Europe/Paris` (`CE%sT`)
- `Asia/Tokyo` (`JST`)
- `America/Sao_Paulo` (`%z` → numeric `-03/-02`)

```
cd samples/cli
pnpm run:sample
```

Optional args override the default source and locale root:

```
pnpm run:sample -- /path/to/tzdata /path/to/locale
```
