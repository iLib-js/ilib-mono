1. Each sample should be placed in its respective package `packages/<package-name>/samples/<sample-name>`
2. For users, it should be easy to run the sample and understand what it does
   a. they should not need to perform extra setup steps (other than `pnpm install` and `pnpm build` on repo root)
   b. after that, they should be able to run the sample by cd'ing into the sample directory and running a single command `pnpm run:sample`
   c. each sample should have a readme which explains the sample project, e.g. _this is a react-intl project, loctool will extract strings from a JSON file in i18n/en.json and produce localized files in i18n/<locale>.json_
3. For contributors, it should be possible to use samples during development cycle
   a. each sample should be directly linked to monorepo packages to allow for quick iteration and debugging
   b. each sample should be wrapped in a suite of tests that will verify produced files against snapshots
   c. a test sample run should clean up the files it generated
4. In CI, samples should be used as E2E tests running against a matrix of supported Node versions
   a. sample projects should use _packed_ packages from the monorepo (not linked) to emulate running off of a published bundle
   b. they don't need to clean up after themselves because CI workspace is ephemeral
   c. sample project should have dependencies installation step run using the matrixed Node version to ensure that all dependencies work with the Node version under test (e.g., some dependencies may define their own engine requirements)
   d. sample must be run using matrixed Node version, but tests themselves _do not have to be_ (but it might not be possible to get a CI image which has two Node versions installed simultaneously)
