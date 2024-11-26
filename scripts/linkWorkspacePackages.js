const fs = require("fs");
const semver = require("semver");

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

console.log("Found workspace packages:", workspacePackages);

for (const { path } of workspacePackages) {
    const packageJson = JSON.parse(fs.readFileSync(path));

    for (const category of ["dependencies", "devDependencies", "peerDependencies"]) {
        for (const dependencyName of Object.keys(packageJson[category] ?? [])) {
            const dependencyRange = packageJson[category][dependencyName];
            if (
                !semver.validRange(dependencyRange) ||
                dependencyRange.startsWith("workspace:") ||
                dependencyRange.startsWith("file:")
            ) {
                continue;
            }
            const workspacePackage = workspacePackages.find(({ name }) => name === dependencyName);
            if (workspacePackage) {
                const versionMatches = semver.satisfies(workspacePackage.version, dependencyRange);
                if (versionMatches) {
                    console.log(`Linking ${dependencyName} in ${packageJson.name}`);
                    packageJson[category][dependencyName] = `workspace:*`;
                } else {
                    console.error(
                        `Version mismatch for ${dependencyName} in ${packageJson.name}. Expected ${dependencyRange}, but found ${workspacePackage.version}`
                    );
                }
            }

            fs.writeFileSync(path, JSON.stringify(packageJson, null, 4) + "\n");
        }
    }
}
