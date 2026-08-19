# mojito-sdk

TypeScript SDK for the
[Mojito translation management system](https://github.com/box/mojito).

## Architecture

- **Auth** — Mojito CLI-compatible STATEFUL (form login + CSRF) and HEADER modes
- **Low-level client** — OpenAPI operation marshalling (`LowLevelClient`)
- **Object model** — `MojitoClient`, `Repository`, `Drop`, `TextUnit`, `Locale`, …

## Installation

```sh
npm install mojito-sdk
```

## Quick start

```ts
import { MojitoClient, getSdkVersion, getOpenApiSpecVersion } from "mojito-sdk";

console.log(getSdkVersion(), getOpenApiSpecVersion());

// Uses ~/.l10n/config/cli properties by default (same as the Mojito CLI).
const client = new MojitoClient();
const repos = await client.listRepositories({ name: "my-repo" });
for (const repo of repos) {
    console.log(repo.id, repo.name);
}
```

Explicit connection options:

```ts
const client = new MojitoClient({
    scheme: "https",
    host: "mojito.example.com",
    port: 443,
    username: "alice",
    password: process.env.MOJITO_PASSWORD,
});
```

## Sample CLI

```sh
pnpm --filter mojito-sdk-cli-sample run:sample -- version
pnpm --filter mojito-sdk-cli-sample run:sample -- repos list
pnpm --filter mojito-sdk-cli-sample run:sample -- drops list --repository-id 123
```

## Documentation

See [`docs/object-model.md`](docs/object-model.md) for the object model and
compatibility guarantees. The cached OpenAPI document lives in
[`openapi/openapi.json`](openapi/openapi.json).

## Development

```sh
pnpm --filter mojito-sdk build
pnpm --filter mojito-sdk test
pnpm --filter mojito-sdk test:e2e
```

## License

Apache-2.0
