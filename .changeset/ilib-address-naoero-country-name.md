---
"ilib-address": patch
---

Updated the country name for region code `NR` from "Nauru" to "Naoero" in the
locale data and the corresponding unit tests. In May 2026, the Parliament of
Nauru passed a constitutional amendment to change the country's official
English name to Republic of Naoero, matching the spelling in the Nauruan
language; the change was later finalized without a referendum. See
[Naoero](https://en.wikipedia.org/wiki/Naoero) for background.

- Renamed the `NR` entry in 392 `ctrynames.json` files, including the embedded
  Latin forms in other languages such as "i-Nauru" (zu), "Emetab Nauru" (kln),
  "Nauru nutome" (ee), and "Sǝr Nauru" (mua)
- Renamed the Nauru district entry in the Portuguese `regionnames.json`
- Added "naoero" to the English country name table in `Countries.js`, and kept
  the existing "nauru" entry there so that addresses written with the old name
  still parse to `NR`. These names are only used for parsing, so the country
  appears just once, as "Naoero", in the list returned by `getFormatInfo`.

The ISO region code (`NR`), the ISO 3166-1 alpha-3 code (`NRU`), the IANA time
zone id (`Pacific/Nauru`), and the language name for `na` are unchanged pending
further official updates.
