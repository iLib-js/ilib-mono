# Mini tzdata for the ilib-zic sample

Excerpted from [IANA tzdata 2026e](https://www.iana.org/time-zones)
(`~/src/tz/tzdata2026e`). Extensionless files hold region data; `zone.tab`
and `backward` are required for the enrich step of `ZoneInfoPipeline`.

| File | Zone / role | Notes |
|------|-------------|-------|
| `northamerica` | `America/New_York` | Rules `US`, `NYC`; FORMAT `E%sT` |
| `europe` | `Europe/Paris` | Rules `France`, `C-Eur`, `EU`; FORMAT `CE%sT` |
| `asia` | `Asia/Tokyo` | Rule `Japan`; FORMAT `JST` |
| `southamerica` | `America/Sao_Paulo` | Rule `Brazil`; FORMAT `%z` → `-03/-02` |
| `zone.tab` | Country mapping | Curated subset of IANA `zone.tab` |
| `backward` | Alias links | e.g. `US/Eastern` → `America/New_York` |

Compile with the sample CLI (defaults to this directory → `../locale`):

```
pnpm run:sample
```
