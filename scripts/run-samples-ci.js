// Note: this script is currently not used
// This is a WIP script with a possible solution to run sample projects in CI.
// It will:
// 1. Build all publishable packages in the monorepo
// 2. Pack all publishable packages into tarballs in a common directory `packs` (to emulate a publish)
// 3. Visit each sample project and run `npm install` (note it's npm not pnpm because we're planning to test compatibility with older node versions as well)
// 4. npm run:sample in each of them
// Note: This is a first iteration of the samples runner.
// In future every sample should be wrapped in a suite of E2E tests which will:
// - perform the appropriate setup and execution of each sample
// - check files which should be produced by the sample against snapshots

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");

// TODO build and pack should be a separate step in the pipeline,
// before we start running on Node version matrix
execSync("pnpm build", { cwd: repoRoot, stdio: "inherit" });

const packsDir = path.resolve(repoRoot, "packs");
fs.rmSync(packsDir, { recursive: true, force: true });
execSync("pnpm -F './packages/*' exec pnpm pack --pack-destination ../../packs/", { cwd: repoRoot, stdio: "inherit" });
// rename tarballs to strip version
for (const tarball of fs.readdirSync(packsDir)) {
    const newName = tarball.replace(/-[\d\.]+.tgz$/, ".tgz");
    console.log(`Renaming ${tarball} to ${newName}`);
    fs.renameSync(path.resolve(packsDir, tarball), path.resolve(packsDir, newName));
}

// iterate over all samples
// packages/*/samples/*
const samples = fs
    .readdirSync(path.resolve(repoRoot, "packages"))
    .map((package) => path.resolve(repoRoot, "packages", package, "samples"))
    .filter((maybeSampleRoot) => fs.existsSync(maybeSampleRoot) && fs.statSync(maybeSampleRoot).isDirectory())
    .flatMap((sampleRoot) => fs.readdirSync(sampleRoot).map((sample) => path.resolve(sampleRoot, sample)))
    .filter((maybeSample) => fs.existsSync(maybeSample) && fs.statSync(maybeSample).isDirectory());
console.log(`Found ${samples.length} samples`);

for (const sample of samples) {
    console.log(`Running sample ${path.relative(repoRoot, sample)}`);

    // map all workspace:^ dependencies to a link to corresponding tgz
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(sample, "package.json"), "utf8"));
    for (const depType of ["dependencies", "devDependencies"]) {
        if (!packageJson[depType]) {
            continue;
        }
        const dependencies = packageJson[depType];
        const mappedDependencies = Object.fromEntries(
            Object.entries(dependencies).map(([key, value]) => [
                key,
                value === "workspace:^" ? path.relative(sample, path.resolve(packsDir, `${key}.tgz`)) : value,
            ])
        );
        packageJson[depType] = mappedDependencies;
    }
    fs.writeFileSync(path.resolve(sample, "package.json"), JSON.stringify(packageJson, null, 2));

    // run npm install
    fs.rmSync(path.resolve(sample, "node_modules"), { recursive: true, force: true });
    execSync("npm install", { cwd: sample, stdio: "inherit" });

    // run loctool
    execSync("npm run run:sample", { cwd: sample, stdio: "inherit" });

    // cleanup
    fs.rmSync(path.resolve(sample, "node_modules"), { recursive: true, force: true });
    fs.rmSync(path.resolve(sample, "package-lock.json"));
    execSync("git clean -fd", { cwd: sample, stdio: "inherit" });
    execSync("git checkout HEAD -- .", { cwd: sample, stdio: "inherit" });
    execSync("pnpm install", { cwd: sample, stdio: "inherit" });
}
