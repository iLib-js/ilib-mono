const fs = require("fs");

/**
 * @typedef {Object} PackageItem
 * @property {string} name - The name of the package
 * @property {string} path - The path to the package directory
 */

/**
 * @typedef {Object} PackagesInfo
 * @property {number} count - The number of packages
 * @property {PackageItem[]} items - Array of package items
 */

/**
 * @typedef {Object} AffectedPackages
 * @property {string} packageManager - The package manager being used (e.g. "pnpm9")
 * @property {PackagesInfo} packages - Information about the affected packages
 */

// Read the affected packages list from the environment variable
const { AFFECTED_PACKAGES, GITHUB_OUTPUT } = process.env;

if (!AFFECTED_PACKAGES) {
  console.error("No AFFECTED_PACKAGES environment variable found");
  process.exit(1);
}

if (!GITHUB_OUTPUT) {
  console.error("No GITHUB_OUTPUT environment variable found");
  process.exit(1);
}

/**
 * @type {AffectedPackages}
 *
 * @example
 * ```json
 * {
 *   "packageManager": "pnpm9",
 *   "packages": {
 *     "count": 2,
 *     "items": [
 *       {
 *         "name": "ilib-address",
 *         "path": "packages/ilib-address"
 *       },
 *       {
 *         "name": "ilib-lint",
 *         "path": "packages/ilib-lint"
 *       }
 *     ]
 *   }
 * }
 * ```
 */
const affected = JSON.parse(AFFECTED_PACKAGES);

// Generate coverage files paths
const coverageFiles = affected.packages.items
  .map(
    (package) =>
      `${package.name}, ${package.path}/coverage/coverage-summary.json`
  )
  .join("\n");

// Generate junit files paths
const junitFiles = affected.packages.items
  .map((package) => `${package.name}, ${package.path}/junit.xml`)
  .join("\n");

// Write to GitHub Actions output
try {
  fs.appendFileSync(GITHUB_OUTPUT,`coverage-files<<EOF\n${coverageFiles}\nEOF\n`);
  fs.appendFileSync(GITHUB_OUTPUT, `junit-files<<EOF\n${junitFiles}\nEOF\n`);
  
  console.log("Successfully generated coverage and junit files paths");
} catch (error) {
  console.error("Error writing to GITHUB_OUTPUT:", error);
  process.exit(1);
}
