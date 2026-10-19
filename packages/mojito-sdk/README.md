# mojito-sdk

TypeScript SDK for the
[Mojito translation management system](https://github.com/box/mojito).

## Architecture

Applications use the object model (`MojitoClient`, `Server`, `Repository`, `Asset`, …).
Generated DTOs, HTTP transport, and auth sit underneath that layer. See
[`docs/Architecture.md`](docs/Architecture.md).

## Installation

```sh
npm install mojito-sdk
```

## Quick start

```ts
import { MojitoClient, getCompatibleMojitoRange, getMojitoVersion, getSdkVersion } from "mojito-sdk";

console.log(getSdkVersion(), getMojitoVersion(), getCompatibleMojitoRange());

// Layers ~/.l10n/config/cli application.properties + application-{profile}.properties
// for profiles cli,formlogincredentialprovider (same as the local `mojito` wrapper).
const client = new MojitoClient();
const repos = await client.server.repositories({ name: "my-repo" });
for (const repo of repos) {
    console.log(repo.id, repo.name);
}
```

Choose exact files or other profiles when needed:

```ts
const client = new MojitoClient({
    configDir: "~/.l10n/config/cli",
    profiles: ["dev", "formlogincredentialprovider"],
});

// Or name the files explicitly (later wins):
const clientFromFiles = new MojitoClient({
    configFiles: [
        "~/.l10n/config/cli/application.properties",
        "~/.l10n/config/cli/application-cli.properties",
    ],
});
```

Explicit connection options without CLI files:

```ts
const client = new MojitoClient({
    loadCliConfig: false,
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
pnpm --filter mojito-sdk test:integration
```

Live Mojito connection tests live under `test-integration/` and are skipped
unless you create a local credentials file. See
[`test-integration/README.md`](test-integration/README.md).

## License

Apache-2.0
