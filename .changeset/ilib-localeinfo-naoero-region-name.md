---
"ilib-localeinfo": patch
---

Updated the region name for region code `NR` from "Nauru" to "Naoero". In May
2026, the Parliament of Nauru passed a constitutional amendment to change the
country's official English name to Republic of Naoero, matching the spelling in
the Nauruan language; the change was later finalized without a referendum. See
[Naoero](https://en.wikipedia.org/wiki/Naoero) for background.

Region names are generated from CLDR, which still publishes "Nauru", so
`scripts/regions.js` now has an overrides table that keeps the generated data
on "Naoero". The entry should be removed once CLDR catches up.

The IANA time zone id (`Pacific/Nauru`) and the language name for the `na`
locale are unchanged pending further official updates, and both are now covered
by unit tests so that a future rename does not change them by accident.
