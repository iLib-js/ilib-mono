const fs = require("fs");

// usage: node scripts/binary-scripts.js
// This script will modify the package.json files of all packages in the `packages` directory
// to use Jest js binary `node_modules/jest/bin/jest.js` instead of the pnpm shell wrapper
// `node_modules/.bin/jest` to avoid the issue described in https://github.com/pnpm/pnpm/issues/8863;
// It will also print a set of all scripts from all packages for visual inspection
// in case any further bulk fixes are needed - to use mapping, add a new entry to the `scriptsMap` object
// with the original script as the key and the new script as the value

const scriptsSet = new Set();

const scriptsMap = new Map([
    [`jest`, `node node_modules/jest/bin/jest.js`],
    [
        `LANG=en_US.UTF8 NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" jest`,
        `LANG=en_US.UTF8 node --experimental-vm-modules node_modules/jest/bin/jest.js`,
    ],
    [
        `LANG=en_US.UTF8 NODE_OPTIONS="$NODE_OPTIONS --experimental-vm-modules" jest --testEnvironment node`,
        `LANG=en_US.UTF8 node --experimental-vm-modules node_modules/jest/bin/jest.js --testEnvironment node`,
    ],
]);

const packageFiles = fs
    .readdirSync("packages")
    .map((package) => `packages/${package}/package.json`)
    .filter((file) => fs.existsSync(file));

for (const path of packageFiles) {
    const data = fs.readFileSync(path, "utf8");
    const pkg = JSON.parse(data);

    const { scripts } = pkg;
    if (!scripts) {
        continue;
    }

    let didModify = false;
    for (const [scriptName, scriptValue] of Object.entries(scripts)) {
        if (scriptsMap.has(scriptValue)) {
            scripts[scriptName] = scriptsMap.get(scriptValue);
            didModify = true;
        }
    }
    if (didModify) {
        fs.writeFileSync(path, JSON.stringify(pkg, null, 4));
    }

    Object.values(scripts).forEach((scriptValue) => scriptsSet.add(scriptValue));
}

console.log([...scriptsSet].sort().join("\n"));
