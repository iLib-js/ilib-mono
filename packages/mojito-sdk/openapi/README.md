# OpenAPI snapshot

- `openapi.json` — Mojito OpenAPI document used to generate this SDK build
- `generated-types.ts` — full `openapi-typescript` output (reference only; not
  part of the compiled package entrypoint)

Regenerate by running the **Generate Mojito SDK** skill, which fetches
`mojito api --spec`, diffs this snapshot, and updates `src/lowlevel/`.
