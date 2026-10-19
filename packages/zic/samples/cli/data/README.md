# Mini tzdata for the ilib-zic sample

Excerpted from [IANA tzdata 2026e](https://www.iana.org/time-zones)
(`~/src/tz/tzdata2026e`). Each extensionless file holds one region with a
single zone and the `Rule` lines it references:

| File | Zone | Rule sets |
|------|------|-----------|
| `northamerica` | `America/New_York` | `US`, `NYC` |
| `europe` | `Europe/Paris` | `France`, `C-Eur`, `EU` |
| `asia` | `Asia/Tokyo` | `Japan` |

Compile with the sample CLI (defaults to this directory):

```
pnpm run:sample
```
