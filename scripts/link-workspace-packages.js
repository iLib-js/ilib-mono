const fs = require("fs");
const semver = require("semver");

// This script will link all monorepo packages with each other
// usage: node scripts/link-workspace-packages.js

const workspacePackages = fs
    .readdirSync("packages")
    .map((package) => {
        const path = `packages/${package}/package.json`;
        if (!fs.existsSync(path)) {
            console.error(`package.json not found for ${package}`);
            return null;
        }
        const packageJson = JSON.parse(fs.readFileSync(path));
        return { path, name: packageJson.name, version: packageJson.version };
    })
    .filter((it) => it !== null);

console.log("Found workspace packages:", workspacePackages.map(({ name, version }) => `${name}@${version}`).join(", "));

for (const { path } of workspacePackages) {
    console.log(`Processing dependencies of ${path}`);
    const packageJson = JSON.parse(fs.readFileSync(path));

    for (const category of ["dependencies", "devDependencies", "peerDependencies"]) {
        for (const dependency of Object.keys(packageJson[category] ?? [])) {
            const workspacePackage = workspacePackages.find(({ name }) => name === dependency);
            if (!workspacePackage) {
                continue;
            }

            const range = packageJson[category][dependency];
            if (range === "workspace:^") {
                console.log(`Already linked ${dependency} in ${packageJson.name}`);
                continue;
            }

            if (range.startsWith("workspace:")) {
                // don't overwrite if a different specifier is used, but warn about it
                console.warn(
                    `Already linked ${dependency} in ${packageJson.name}, but with an unexpected specifier: ${range}`
                );
                continue;
            }

            if (!semver.validRange(range)) {
                // ensure it's semver to avoid blindly linking incompatible versions
                console.error(`Invalid version specifier for ${dependency} in ${packageJson.name}: ${range}`);
                continue;
            }

            // verify that the version in the workspace package satisfies range of this dependency
            // (this is in case we roll out a breaking change in the monorepo
            // but then attempt to migrate an older package that still depends on the old version)
            const versionMatches = semver.satisfies(workspacePackage.version, range);
            if (!versionMatches) {
                console.error(
                    `Incompatible version for ${dependency} in ${packageJson.name}. Package needs ${range}, but workspace has ${workspacePackage.version}`
                );
            }

            // https://pnpm.io/workspaces#workspace-protocol-workspace
            // using caret to produce a caret range when published
            console.log(`Linking ${dependency} in ${packageJson.name}`);
            packageJson[category][dependency] = `workspace:^`;
        }
    }

    fs.writeFileSync(path, JSON.stringify(packageJson, null, 4));
    console.log();
}
