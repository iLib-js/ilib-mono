# Dependency resolution in test fixture packages

Small amount of tests within the monorepo actually relies on Node's actual package resolution mechanism. These tests utilize _test fixture packages_ (i.e. nested directories with `package.json` files and optionally some code) that are being loaded via real `import`/`require` calls (and sometimes load more dependencies too).

The problem is that we don't want these test fixture packages to be explicitly included in our workspace, as they are not "interactive" - the user should not be able to run their scripts, they should not be published, etc. Yet, we still need the dependency resolution **from** and **to** these test fixture packages to work - an actual package should be able to resolve a test fixture package and vice versa.

It's easy to load a test fixture package that's not in the workspace - just depend on it by relative path using the `file:` protocol. Turns out however, that the package manager will not descend into such packages - it will only link the specified directory, but not resolve its dependencies further.

The solution lies in Node's package resolution algorithm, which actually isn't limited to just `$(cwd)/node_modules` - rather, will go up the directory tree and check every `${ancestor}/node_modules` directory.

This means that we don't need our package manager to resolve dependencies of the test fixture packages - instead, we provide necessary packages as devDependencies of the parent package (i.e. package under test).

## Usecases

### Testing importing plugins

`ilib-lint` unit tests verify linter plugin name/path resolution, compatibility checks and loading mechanism. In real world, such plugins would be sourced from NPM alongside the linter itself as dependencies of an application package, e.g.:

```json
{
    "name": "some-frontend-app",
    "version": "18.0.0",
    "description": "An application that uses python-format strings",
    "devDependencies": {
        "ilib-lint": "1.0.0",
        "ilib-lint-python": "1.0.0"
    },
    "scripts": {
        "lint:translations": "ilib-lint ."
    }
}
```

In tests, we use minimal test plugins embedded in aforementioned _test fixture packages_ (like `packages/ilib-lint/test/ilib-lint-plugin-test`). We don't want them to be an explicit part of our workspace, as they are not "interactive". In fact, some of them aren't even valid - e.g., `packages/ilib-lint/test/ilib-lint-plugin-obsolete` purposefully depends on a lower version of `ilib-lint-common` to trigger the compatibility error. We don't want our package manager to actually pull an obsolete version of `ilib-lint-common` from NPM though.

### Testing the ability to be imported

`ilib-scriptinfo` E2E tests verify that it can be loaded from different module environments (CJS/ESM/TS-CJS). Again, in real world, this library would be sourced from NPM as a dependency of an application package, e.g.:

```json
{
    "name": "some-esm-app",
    "version": "18.0.0",
    "type": "module",
    "devDependencies": {
        "ilib-scriptinfo": "1.0.0"
    },
    "scripts": {
        "run": "node src/some-esm-app.js"
    }
}
```

We use test fixture packages (like `packages/ilib-scriptinfo/test-e2e/__testfiles__/esm-test`) to specify different module resolution environments via their `package.json` `type` field.

## Interdependency variants

### Variant 1: Loading the test fixture package

Unit tests of `ilib-lint` load a test plugin from a test fixture package `ilib-lint-plugin-test`.

```js
// test code:
function test() {
    const plugin = pluginManager.load("ilib-lint-plugin-test");
    // calls require("ilib-lint-plugin-test") internally
}
```

Normally, `ilib-lint` and `ilib-lint-plugin-test` would both be dependencies of a parent (like in the `some-frontend-app` example) - but we don't want our package manager to interact with the test plugin package as explained above. Instead, we point at test fixture package through a `file:` devDependency:

```json
{
    "name": "ilib-lint",
    "devDependencies": {
        "ilib-lint-plugin-test": "file:./test/ilib-lint-plugin-test"
    }
}
```

`pnpm install` results in:

- `packages/ilib-lint/node_modules` created
- `packages/ilib-lint/node_modules/ilib-lint-plugin-test` created (symlink to `packages/ilib-lint/test/ilib-lint-plugin-test`)
- `packages/ilib-lint/test/ilib-lint-plugin-test/node_modules` not created (not part of workspace)

Then, when a test `packages/ilib-lint/test/some.test.js` triggers `require('ilib-lint-plugin-test')`, it checks:

1. `packages/ilib-lint/test/node_modules/ilib-lint-plugin-test`
2. `packages/ilib-lint/node_modules/ilib-lint-plugin-test` => found! (linking to `ilib-lint/test/ilib-lint-plugin-test`)

Note that dependencies specified in `ilib-lint-plugin-test/package.json` are not resolved due to the `file:` protocol (package manager only links the specified directory, but does not resolve its dependencies further; that part is handled via Variant 2 below).

### Variant 2: Providing dependencies for test fixture packages

Unit tests of `ilib-lint` load a test plugin from a test fixture package `ilib-lint-plugin-test`. That plugin loads common linter plugin interface:

```js
// plugin code:
const common = require("ilib-lint-common");
```

The test fixture package has a dependency on common linter plugin interface:

```json
{
    "name": "ilib-lint-plugin-test",
    "dependencies": {
        "ilib-lint-common": "1.0.0"
    }
}
```

Test plugin is not part of the workspace, so it gets no `node_modules` of its own. Anything specified in `ilib-lint-plugin-test/package.json` is ignored (it's only required for `ilib-lint` custom compatibility check).

To make it work, the parent package `ilib-lint` provides necessary dependencies for that test plugin via its own `devDependencies`:

```json
{
    "name": "ilib-lint",
    "devDependencies": {
        "ilib-lint-common": "workspace:^"
    }
}
```

`pnpm install` results in:

- `packages/ilib-lint/node_modules` created
- `packages/ilib-lint/test/ilib-lint-plugin-test/node_modules` not created (not part of workspace)
- `packages/ilib-lint/node_modules/ilib-lint-common` created

When the plugin code in `packages/ilib-lint/test/ilib-lint-plugin-test/src/index.js` triggers `require("ilib-lint-common")`, it checks:

1. `packages/ilib-lint/test/ilib-lint-plugin-test/node_modules/ilib-lint-common`
2. `packages/ilib-lint/test/node_modules/ilib-lint-common`
3. `packages/ilib-lint/node_modules/ilib-lint-common` => found!

### Variant 3: Loading the package itself from a test fixture package

E2E tests for `ilib-scriptinfo` spawn a Node subprocess that executes a script from within a test fixture package `packages/ilib-scriptinfo/test-e2e/__testfiles__/esm-test`.

The test fixture package specifies its module resolution kind in `package.json`:

```json
{
    "name": "esm-test",
    "type": "module"
}
```

Script within that package loads `ilib-scriptinfo`:

```ts
import { ScriptInfo } from "ilib-scriptinfo";
```

Again, test fixture package is not part of the workspace, so it gets no `node_modules` of its own. (Like explained in Variant 2 above, it does not even need to specify any dependencies, since they are not being resolved anyway).

To make it work, the parent package `ilib-scriptinfo` declares a named dependency on itself, again using the `file:` protocol:

```json
{
    "name": "ilib-scriptinfo",
    "devDependencies": {
        "ilib-scriptinfo": "file:."
    }
}
```

`pnpm install` results in:

- `packages/ilib-scriptinfo/node_modules` created
- `packages/ilib-scriptinfo/test-e2e/__testfiles__/esm-test/node_modules` not created (not part of workspace)
- `packages/ilib-scriptinfo/node_modules/ilib-scriptinfo` created (symlink to `packages/ilib-scriptinfo`)

When the script code in `packages/ilib-scriptinfo/test-e2e/__testfiles__/esm-test/index.js` triggers `import { ScriptInfo } from "ilib-scriptinfo"`, it checks:

1. `packages/ilib-scriptinfo/test-e2e/__testfiles__/esm-test/node_modules/ilib-scriptinfo`
2. `packages/ilib-scriptinfo/test-e2e/node_modules/ilib-scriptinfo`
3. `packages/ilib-scriptinfo/node_modules/ilib-scriptinfo` => found!
