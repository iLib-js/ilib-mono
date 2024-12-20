# Migration of existing ilib-js packages to monorepo

Below is a list of aspect that need to be accounted for when migrating existing ilib-js packages into the monorepo. Please note this list is not exhaustive and also that it may be updated as the repo evolves.

-   **History**
    -   Package should be migrated along with its commit history using [`git subtree`](https://www.atlassian.com/git/tutorials/git-subtree) - this is automated through [`scripts/add_repo.sh`](../scripts/add_repo.sh); remember to do a _regular merge_ (not a _squash merge_) when merging the migration PR
    -   Original package repository should have a deprecation notice with a link to the monorepo and it should be marked as [archived](https://docs.github.com/en/repositories/archiving-a-github-repository/archiving-repositories); see [`scripts/push_deprecation.sh`](../scripts/push_deprecation.sh) and [`scripts/archive_repos.sh`](../scripts/archive_repos.sh)
    -   Tags/releases should be migrated in the new format `<package-name>@<version>` (e.g. `ilib-common@1.0.0`); thanks to using subtree, commits of those tags will NOT change; see [`scripts/sync_tags.sh`](../scripts/sync_tags.sh)
-   **Structure**
    -   The package should be placed in `packages/<package-name>` directory (handled by subtree script)
    -   Build artifacts should be placed in `lib` directory
    -   All docs should be placed in `docs` directory - this includes the generated HTML pages and their assets (we plan to switch to a cleaner solution soon)
-   **Dependencies**
    -   **Internal Dependencies**: If the package depends on other packages that are in the monorepo already, update them to use `workspace:^`; verify if any breaking changes were introduced between explicit dependency version and current workspace head and update migrated package accordingly
    -   **External Dependencies**: Ensure that all dependencies are included since pnpm uses [_isolated `node_modules`_](https://pnpm.io/motivation#creating-a-non-flat-node_modules-directory)
    -   **Dependents**: If the package is depended upon by other packages in the monorepo, update them to use `workspace:^` () and verify everything works as expected
    -   **Conditional Install**: Some of ilib packages utilized conditional install package in the prepare script to install Jest 26 when developing on older Node versions - this should be removed and Jest should be specified directly in devDependenciess
    -   **Workspace Dependency Conflicts**: In principle, pnpm should prevent issues with conflicting versions between workspace packages - unfortunately it's not perfect (see [pnpm issue #8863](https://github.com/pnpm/pnpm/issues/8863)); as of now, the only recommendation is to ensure that Jest should be installed in latest version common for all workspace packages
-   **Scripts**:
    -   **Package manager**: Update all applicable scripts to use `pnpm` instead of `npm`
    -   **Multi scripts**: If the package uses `npm-run-all`, add option `--npm-path pnpm`; alternatively, you can switch to `pnpm`'s [built-in support](https://pnpm.io/cli/run#running-multiple-scripts) for running multiple scripts through regex like `pnpm run /test:/`
    -   **Binstubs `node_modules/.bin`**: unlike npm, pnpm provides only shell wrappers inside of `node_modules/.bin` (see Binstubs in [pnpm limitations](https://pnpm.io/limitations)) so if any script uses `node <nodeOptions> node_modules/.bin/some-binary`, it should be updated to `NODE_OPTIONS="$NODE_OPTIONS <nodeOptions>" node_modules/.bin/some-binary` or switch to `node <nodeOptions> node_modules/some-lib/direct-path-to/some-binary.js` (note that using the first option can cause dependency issues - see [pnpm issue #8863](https://github.com/pnpm/pnpm/issues/8863))
-   **Lifecycle**
    -   **CI**: Leftover CI configuration (like CircleCI) should be removed from the package directory after migration; CI is handled by the monorepo through GitHub Actions workflows common for the whole monorepo
    -   **Build**: If the package requires a build step, it should be added as `build` in its `package.json`; it should produce artifacts in `lib` directory which are ready for publishing; note that monorepo packages depend on each other so the build script (called automatically before tests) should produce complete ouptut as if the package was published to npm (so that it can be depended upon)
    -   **Test**: The package should define a `test` script that runs all tests; if using jest, make sure to invoke it with `node node_modules/jest/bin/jest.js` instead of the binary wrapper (to mitigate risk of incorrectly hoisted dependencies - see [pnpm issue #8863](https://github.com/pnpm/pnpm/issues/8863)); build script is called automatically before running tests, so remove it from the test script if it's already there; for now, all tests run in Node 20 with Chrome, we're planning to set up additional workflows for environment matrix testing soon
    -   **Doc**: The package can define a `doc` script to generate HTML documentation; it should produce artifacts in `docs` directory; this is not called automatically at any point - remember to run it manually in a PR and commit the generated files
    -   **Publish**: Package should NOT define any custom `version` or `publish` scripts as it will be handled by the monorepo (using changesets and pnpm release, see [release CI workflow](../.github/workflows/release.yml)); while pnpm should call `prepublish` script implicitly, it's recommended that all things needed for publishing should be handled in the `build` script
-   **Package**
    -   **Name**: No need to update the name of the package, as we are not using any namespace like `@ilib-js/`
    -   **Version**: No need to update the version of the package, as it will be handled by the monorepo
    -   **Files**: Package should have a `files` field in its `package.json` that lists only files that should be included in the published package; DO include: `src` (even in TS packages for debugging purposes), `lib` (if applicable), `README.md`, `LICENSE`; DO NOT include: `docs` (generated docs should not be included in npm bundle); verify that no files are missing from the bundle by building and packing locally and comparing contents against latest published tarball downloaded from npm (see script `scripts/compare-package-contents.sh`)
    -   **Links**: Update all links to point to the monorepo; keep in mind that the links to files or directories within the repo must include the branch, so `github.com/ilib-js/ilib-common` should become `github.com/ilib-js/ilib-mono/tree/main/packages/ilib-common` etc. (`tree` is for directories, `blob` is for files but currently GH redirects between those two automatically); repository URL should point to the monorepo root `https://github.com/iLib-js/ilib-mono.git`
    -   **Entrypoints**: Package should correctly define its entrypoints, i.e. it MUST have a `main` field and optionally `module`, `types` and `exports`; see [Node.js documentation](https://nodejs.org/api/packages.html#package-entry-points) for more information and also validation script [`scripts/check-package-exports.js`](../scripts/check-package-exports.js)
-   **Changelog**
    -   **Generation**: Changelog entries and version updates are handled automatically through [changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md); note that the file will be automatically updated (including reformatting by prettier)
    -   **Migration**: If the package already has a changelog, it should be adjusted to the monorepo format; existing entries should be migrated to the `CHANGELOG.md` file structured as follows: mandatory H1 `# package-name` and H2 version `## X.Y.Z` (no `v` prefix), then optionally: H3 `### kind Changes` (e.g. `### Patch Changes`) and bullet points with changes; see [`packages/ilib-assemble/CHANGELOG.md`](../packages/ilib-assemble/CHANGELOG.md) for an example; README should be updated to point to the new location of the changelog; to verify the changelog is correctly formatted, optionally run changelog generation using `pnpm changeset version` (ensure you've added a changeset first and that you don't accidentally overwrite your WIP) and inspect the updated file
-   **License**: Package should be licensed under Apache-2.0 license; make sure to include the license file in the repository and publish bundle (`files` field in `package.json`)
-   **Documentation**
    -   **Links**: Update all links in the documentation to point to the new location in the monorepo - see notes on links above
-   **Environment**
    -   **Node**: Package should work with Node.js 12 LTS and newer
    -   **TypeScript**: If the package is written in TS, it should use configuration similar to [`ilib-po`](../packages/ilib-po/tsconfig.json) package (shared configuration will be extracted in the future); in particular, note that to ensure that the package works on Node 12, `tsconfig.json` should extend `@tsconfig/node12` and `@types/node@12` [sic - major 12] should be installed.
-   **Gitignores**: There should be no package-specific `.gitignore`; we opt to use a single `.gitignore` in the monorepo root to ensure consistent package structure and increase visibility of outliers; if the package has its own `.gitignore`, it should be removed, and the monorepo root `.gitignore` should be updated to include any package-specific entries; remember to verify gitignore changes by running the package's scripts - in particular, run `test` script to ensure that all generated files are cleaned up or ignored
-   **Release**
    -   **Changeset**: Create a changeset for the package to be published; at the very least, it should be a `patch` bump mentioning the package migration to the monorepo; note that this changeset should also include all dependents of the package (if any) to track that they have been linked to the monorepo version of the package
    -   **Publish**: After merging, follow the release process to publish your package from within the monorepo

## Step-by-step

1. Migrate repo as subtrees `scripts/add_repo.sh package1 package2`
2. Remove old ci config `rm -r packages/{package1,package2}/.circleci`
3. Remove conditional-install from `prepare` scripts and devDependencies, readd `jest` to devDependencies directly
4. Link workspace packages `node scripts/link-workspace-packages.js && pnpm install`
5. Validate package entrypoints `node scripts/check-package-exports.js`
6. Ensure all scripts use `pnpm` instead of `npm` (incl. `npm-run-all`)
7. Ensure `build` is present (if applicable) and runs everything that's needed for publishing the package (e.g. `build:prod`, `build:pkg` and `build:locales`)
8. Ensure `test` script is present and runs all unit tests (e.g. `test:cli` and `test:web` if applicable)
9. Ensure no test script runs `build`
10. Replace `jest` binstub calls in scripts to `node node_modules/jest/bin/jest.js`
11. Run tests for all affected packages `pnpm test` (from monorepo root) and keep fixing until it works
12. Update `jest` (and related) to latest `pnpm --filter '[origin/main]' up --latest '*jest*'` and rerun tests
13. Ensure scripts generate files to expected directories (`build` to `lib`, `doc` to `docs`)
14. Ensure `files` in `package.json` lists only files that should be included in the published package (remove `docs`), verify nothing's missing from package bundles `scripts/compare-package-contents.sh`
15. Update changelogs to monorepo format; create test changeset `pnpm changeset` and test automated changelog updates with `pnpm changeset version` then revert both
16. Update links in package.json to point to the monorepo
17. Update links in documentation and source code to point to the monorepo
18. Ensure package is licensed under Apache-2.0
19. Create changeset `pnpm changeset` and patchbump migrated packages with changelog message about migration
