# mojito-sdk samples

The `cli` sample exercises the public SDK and forms the basis of the package's
end-to-end tests.

```sh
pnpm --filter mojito-sdk-cli-sample run:sample -- version
pnpm --filter mojito-sdk-cli-sample run:sample -- repos list
pnpm --filter mojito-sdk-cli-sample run:sample -- me
```

Commands that access Mojito authenticate via the SDK using the same
`~/.l10n/config/cli` properties as the Mojito CLI.
