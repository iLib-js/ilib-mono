// Usage: node scripts/check-ilib-es6-version.js
// ilib-es6 is a thin wrapper around ilib, and its version is required to match the
// version of ilib that it wraps exactly. Changesets cannot express that constraint,
// since ilib is an external dependency that changesets does not version. Instead,
// this script verifies that the bump type of any pending changeset for ilib-es6 will
// produce a version equal to the pinned ilib dependency once the release runs.

const fs = require("fs");
const path = require("path");
const semver = require("semver");

const PACKAGE_NAME = "ilib-es6";
const PACKAGE_PATH = path.join("packages", PACKAGE_NAME, "package.json");
const CHANGESET_DIR = ".changeset";

const BUMP_TYPES = ["patch", "minor", "major"];

// Reads the bump type that pending changesets will apply to the given package.
// When multiple changesets name the package, changesets applies the largest bump.
function getPendingBump(packageName) {
    const files = fs.readdirSync(CHANGESET_DIR).filter((file) => file.endsWith(".md") && file !== "README.md");

    let bump;

    for (const file of files) {
        const contents = fs.readFileSync(path.join(CHANGESET_DIR, file), "utf8");
        const frontmatter = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!frontmatter) continue;

        for (const line of frontmatter[1].split(/\r?\n/)) {
            const entry = line.match(/^\s*["']?(.+?)["']?\s*:\s*(patch|minor|major)\s*$/);
            if (!entry || entry[1] !== packageName) continue;

            if (!bump || BUMP_TYPES.indexOf(entry[2]) > BUMP_TYPES.indexOf(bump)) {
                bump = entry[2];
            }
        }
    }

    return bump;
}

const pkg = JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
const ilibVersion = pkg.dependencies?.ilib;

if (!ilibVersion) {
    console.error(`${PACKAGE_PATH}: no ilib dependency found`);
    process.exit(1);
}

if (!semver.valid(ilibVersion)) {
    console.error(
        `${PACKAGE_PATH}: the ilib dependency must be pinned to an exact version so that ${PACKAGE_NAME} can match it, but it is "${ilibVersion}"`
    );
    process.exit(1);
}

const bump = getPendingBump(PACKAGE_NAME);
const releaseVersion = bump ? semver.inc(pkg.version, bump) : pkg.version;

if (releaseVersion === ilibVersion) {
    console.log(`${PACKAGE_NAME} will release as ${releaseVersion}, matching its pinned ilib ${ilibVersion}`);
    process.exit(0);
}

console.error(
    bump
        ? `${PACKAGE_NAME} is at ${pkg.version} with a pending "${bump}" changeset, which releases as ${releaseVersion}, but it pins ilib ${ilibVersion}`
        : `${PACKAGE_NAME} is at ${pkg.version} with no pending changeset, but it pins ilib ${ilibVersion}`
);

const required = BUMP_TYPES.find((type) => semver.inc(pkg.version, type) === ilibVersion);

console.error(
    required
        ? `Add a "${required}" changeset for ${PACKAGE_NAME} so that it releases as ${ilibVersion}.`
        : `No single bump type takes ${pkg.version} to ${ilibVersion}. Set the version in ${PACKAGE_PATH} by hand after "changeset version" runs, or pin a different ilib version.`
);

process.exit(1);
