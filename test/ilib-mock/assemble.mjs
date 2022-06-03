import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { JSUtils, Utils } from 'ilib-common';
import JSON5 from 'json5';

let cache = {};

function assemble(options) {
    let localeData = {};

    if (!options || !options.locales) return undefined;

    const here = join(dirname(import.meta.url.replace(/file:\/\//, "")), "locale");

    options.locales.forEach(locale => {
        var locFiles = Utils.getLocFiles(locale, "mockdata.json").map(file => {
            return join(here, file);
        });
        let locData = {};
        locFiles.forEach(file => {
            if (cache[file]) {
                locData = JSUtils.merge(locData, cache[file]);
            } else if (existsSync(file)) {
                const data = readFileSync(file, "utf-8");
                const json = JSON5.parse(data);
                locData = JSUtils.merge(locData, json);
                cache[file] = json;
            }
        });
        if (!localeData[locale]) {
            localeData[locale] = {};
        }
        localeData[locale].mockdata = JSUtils.merge(localeData[locale].mockdata || {}, locData);
    });

    return Promise.resolve(localeData);
}

export default assemble;