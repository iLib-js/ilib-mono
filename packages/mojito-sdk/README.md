# mojito-sdk

TypeScript SDK for the
[Mojito translation management system](https://github.com/box/mojito).

## Architecture

Applications use the object model (`MojitoClient`, `Repository`, `Asset`, …).
Generated DTOs, HTTP transport, and auth sit underneath that layer. See
[`docs/Architecture.md`](docs/Architecture.md).

## Installation

```sh
npm install mojito-sdk
```

## Quick start

```ts
import { MojitoClient, Repository, getSdkVersion, getMojitoVersion, getCompatibleMojitoRange } from "mojito-sdk";

console.log(getSdkVersion(), getMojitoVersion(), getCompatibleMojitoRange());

// Uses ~/.l10n/config/cli properties by default (same as the Mojito CLI).
const client = new MojitoClient();
const repos = await Repository.list(client, { name: "my-repo" });
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

- [`docs/Architecture.md`](docs/Architecture.md) — layers, generation, and what
  is public vs internal
- [`docs/object-model.md`](docs/object-model.md) — resources, methods, and
  compatibility
- [`openapi/openapi.json`](openapi/openapi.json) — cached Mojito OpenAPI document

## Development

```sh
pnpm --filter mojito-sdk build
pnpm --filter mojito-sdk test
pnpm --filter mojito-sdk test:e2e
```

## License

Apache-2.0
