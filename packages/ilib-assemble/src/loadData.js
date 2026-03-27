
/*
* loadData.js - load locale data from a module
*/


import { existsSync } from 'node:fs';
import path from 'path';

function loadData(moduleName, options) {
    let resolved = moduleName;

    if (!existsSync(path.join(process.cwd(), "js/assemblefiles", resolved + ".mjs"))) {
        if (!options || !options.quiet) console.log(`    No locale data available for module ${moduleName}`);
        return Promise.resolve(true);
    }
    const absPath = path.join(process.cwd(), "js/assemblefiles", moduleName + ".mjs");
    console.log(`Loading data from ${absPath}...`);

    
    return import(`${absPath}`).then(module => {
        //if (!options || !options.quiet) console.log(`    Returning data for module ${moduleName}`);
        console.log(`    Returning data for module ${module}`);
        const assemble = module && module.default;
        if (assemble && typeof(assemble) === 'function') {
            // should return a promise of its own
            return assemble(options);
        }
        return Promise.resolve(false);
    }).catch(err => {
        console.log(err);
        return Promise.resolve(false);
    });
}

export default loadData;
