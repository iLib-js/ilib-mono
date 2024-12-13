// Usage: node scripts/check-package-exports.js
// This script checks that all packages have correct entrypoint fields

const fs = require("fs");

const packageFiles = fs
    .readdirSync("packages")
    .map((package) => `packages/${package}/package.json`)
    .filter((file) => fs.existsSync(file));
for (const path of packageFiles) {
    console.log(`Processing ${path}`);
    const data = fs.readFileSync(path, "utf8");
    const pkg = JSON.parse(data);

    const { main, module } = pkg;

    const type = pkg.type ?? "commonjs";

    // either { exports: { .: { import, require } } } or { exports: { import, require } }
    const exportsRoot = pkg.exports?.["."] ?? pkg.exports;

    if (!main) {
        // main should be present regardless of type
        // because it's the default entry point for a package in Node.js
        // if type is commonjs, it should point to a commonjs file,
        // if type is module, it should point to an es module file
        console.error("No main field found");
    }

    if (type === "module" && !module) {
        // module should be present if type is module
        // this is not officially required, but often used for ESM entry point
        console.error("Type is module, but no module field found");
    }

    if (main && module && main !== module && !exportsRoot) {
        // when both main and module are present and are different,
        // this means that the package provides both CJS and ESM code;
        // in this case, per Node documentation, the package should have an exports field
        // with separate import and require: https://nodejs.org/api/packages.html#conditional-exports
        console.error("Main and module are different, but no exports field found");
    }

    if (exportsRoot && (!type || type === "commonjs") && !exportsRoot.require) {
        console.error("Exports are present and type is commonjs, but no require field found in exports");
    }

    if (exportsRoot && type === "module" && !exportsRoot.import) {
        console.error("Exports are present and type is module, but no import field found in exports");
    }
}
