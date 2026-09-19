# OpenAPI snapshot

- `openapi.json` — Mojito OpenAPI document used to generate this SDK build
- `../src/generated/openapi.ts` — generated TypeScript DTO definitions used
  internally by the object model

Regenerate the snapshot (requires the `mojito` CLI on PATH and working CLI
credentials):

```sh
pnpm --filter mojito-sdk generate:openapi
```

That runs `mojito api --spec` and writes pretty-printed JSON to `openapi.json`.
Run `pnpm --filter mojito-sdk generate:code` to regenerate the DTOs and
low-level operation metadata without fetching the spec, or
`pnpm --filter mojito-sdk generate` to perform both steps.
