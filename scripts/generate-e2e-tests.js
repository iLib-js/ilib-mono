#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// List of packages that have samples and need e2e tests
const packagesWithSamples = [
    "ilib-loctool-ghfm",
    "ilib-loctool-mrkdwn",
    "ilib-loctool-po",
    "ilib-loctool-salesforce-metaxml",
    "ilib-loctool-regex",
    "ilib-loctool-javascript-resource",
    "ilib-loctool-tap-i18n",
    "ilib-loctool-android-resource",
    "ilib-loctool-android-layout",
    "ilib-loctool-php-resource",
];

// Color mapping for display names
const colors = [
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "gray",
    "redBright",
    "greenBright",
    "yellowBright",
    "blueBright",
    "magentaBright",
    "cyanBright",
    "whiteBright",
    "blackBright",
];

function createJestConfig(packageName, color) {
    return `const { jestConfig: baseConfig } = require("@ilib-mono/e2e-test");

const config = {
    ...baseConfig,
    displayName: {
        name: "${packageName} e2e",
        color: "${color}",
    },
};

module.exports = config;
`;
}

function createE2ETestFile(packageName, sampleDirs) {
    let testContent = `const path = require("path");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("@ilib-mono/e2e-test");

describe("samples", () => {`;

    sampleDirs.forEach((sampleDir, index) => {
        const sampleName = sampleDir.replace(/[-_]/g, "");
        testContent += `
    describe("${sampleName}", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "${sampleDir}");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        it("should produce an extracted XLIFF file", () => {
            const xliffPath = path.resolve(projectPath, "xliffs", "sample-${sampleName}-extracted.xliff");
            expectFileToMatchSnapshot(xliffPath);
        });
    });`;
    });

    testContent += `
});
`;

    return testContent;
}

function updatePackageJson(packagePath) {
    const packageJsonPath = path.join(packagePath, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Add test:e2e script if not present
    if (!packageJson.scripts["test:e2e"]) {
        packageJson.scripts["test:e2e"] = "node node_modules/jest/bin/jest.js --config test-e2e/jest.config.cjs";
    }

    // Add e2e-test dependency if not present
    if (!packageJson.devDependencies["@ilib-mono/e2e-test"]) {
        packageJson.devDependencies["@ilib-mono/e2e-test"] = "workspace:^";
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4) + "\n");
}

function generateE2ETests() {
    packagesWithSamples.forEach((packageName, index) => {
        const packagePath = path.join(__dirname, "..", "packages", packageName);
        const samplesPath = path.join(packagePath, "samples");
        const testE2EPath = path.join(packagePath, "test-e2e");

        // Check if samples directory exists
        if (!fs.existsSync(samplesPath)) {
            console.log(`Skipping ${packageName} - no samples directory`);
            return;
        }

        // Create test-e2e directory
        if (!fs.existsSync(testE2EPath)) {
            fs.mkdirSync(testE2EPath, { recursive: true });
        }

        // Get sample directories
        const sampleDirs = fs
            .readdirSync(samplesPath, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        if (sampleDirs.length === 0) {
            console.log(`Skipping ${packageName} - no sample directories found`);
            return;
        }

        // Create jest config
        const jestConfigPath = path.join(testE2EPath, "jest.config.cjs");
        const color = colors[index % colors.length];
        fs.writeFileSync(jestConfigPath, createJestConfig(packageName, color));

        // Create e2e test file
        const testFilePath = path.join(testE2EPath, "samples.e2e.test.js");
        fs.writeFileSync(testFilePath, createE2ETestFile(packageName, sampleDirs));

        // Update package.json
        updatePackageJson(packagePath);

        console.log(`Generated e2e tests for ${packageName} with samples: ${sampleDirs.join(", ")}`);
    });
}

if (require.main === module) {
    generateE2ETests();
}

module.exports = { generateE2ETests };
