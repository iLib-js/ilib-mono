/*
 * generate.js - tool to generate plurals json fragments from
 * the CLDR data files
 *
 * Copyright © 2015-2017, 2020-2023 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * This code is intended to be run under node.js
 */
import fs from 'fs';
import path from 'path';
import { Utils } from 'ilib-data-utils';
import Locale from 'ilib-locale';
import stringify from 'json-stable-stringify';

const merge = Utils.merge;
const mergeAndPrune = Utils.mergeAndPrune;
const makeDirs = Utils.makeDirs;

const moduleRoot = path.resolve(import.meta.dirname, '..');

function loadJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

const pluralData = loadJson(`${moduleRoot}/node_modules/cldr-core/supplemental/plurals.json`);

function usage() {
    console.log("Usage: genplurals [-h]\n" +
        "Generate genplurals information files.\n" +
        "-h or --help\n" +
        "  this help\n");
    process.exit(1);
}

process.argv.forEach((val, index, array) => {
    if (val === "-h" || val === "--help") {
        usage();
    }
});


console.log("genplurals - generate plurals information files.\n" +
    "Copyright (c) 2015-2017, 2020-2023  JEDLSoft");

const pluralsObject = pluralData.supplemental["plurals-type-cardinal"];

const OPERATORS = ['!=', '=', 'is not', 'is', 'not in', 'in', 'not within', 'within'];
const OPERATOR_MAP = {
    '!=': 'neq',
    '=': 'eq',
    '%': 'mod'
};
const MODS = ['mod', '%'];
const VALUES = 'niftvw';

function operator_keyword(operator) {
    const keyword = OPERATOR_MAP[operator];
    if (undefined === keyword) {
        return operator;
    } else {
        return keyword;
    }
}

function extract_count(keyword) {
    return keyword.slice(keyword.lastIndexOf('-') + 1);
}

function extract_condition(rule) {
    const at_position = rule.indexOf('@');

    return rule.slice(0, at_position).trim();
}

function extract_and_conditions(condition) {
    const and_conditions = condition.split('or');

    return and_conditions.map(ac => ac.trim());
}

function extract_relations (and_conditions) {
    const relations = and_conditions.split('and');

    return relations.map(r => r.trim());
}

function create_relation(relation_string) {
    let idx;
    let temp;
    let operator, operand, ranges;
    let relation = {};

    for(idx in OPERATORS) {
        if (relation_string.indexOf(OPERATORS[idx]) !== -1) {
            operator = OPERATORS[idx];
            break;
        }
    }

    if (undefined === operator)
        return undefined;

    temp = relation_string.split(operator);
    operand = create_expr(temp[0]);
    ranges= create_range_list(temp[1]);
    relation[operator_keyword(operator)] = [operand, ranges];

    return relation;
}

function create_expr(operand_string) {
    let idx;
    let mod;
    let temp;
    let operand;
    let module_value;
    let expr = {};

    for (idx in MODS) {
        if (operand_string.indexOf(MODS[idx]) !== -1) {
            mod = MODS[idx];
            break;
        }
    }
    if (undefined === mod) {
        return operand_string.trim();
    }

    temp = operand_string.split(mod);
    operand = temp[0].trim();
    module_value = parseInt(temp[1].trim());
    expr[operator_keyword(mod)] = [operand.trim(), module_value];

    return expr;
}

function create_range_list(ranges_string) {
    let range_string_list;
    let range_list;

    range_string_list = ranges_string.split(',');
    range_list = range_string_list.map(range_string => create_range(range_string.trim()));
    if (1 === range_list.length)
        return range_list[0];
    else
        return range_list;
}

function create_range(range_string) {
    let range_item_list;

    range_item_list = range_string.split('..');

    if (1 === range_item_list.length) {
        return parseInt(range_item_list[0].trim());
    } else {
        return [parseInt(range_item_list[0].trim()),
                parseInt(range_item_list[1].trim())];
    }
}

function is_valid_condition(condition) {
    return (condition === undefined ? false : true);
}

function create_and_condition(and_condition_string) {
    let relations;
    let and_condition;

    relations = extract_relations(and_condition_string).
        map(relation_string => create_relation(relation_string)).
        filter(is_valid_condition);

    if (0 === relations.length) {
        return undefined;
    } else if (1 === relations.length) {
        return relations[0];
    } else {
        return {'and': relations};
    }
}

function create_condition(condition_string) {
    let and_conditions;

    and_conditions = extract_and_conditions(condition_string).
        map(and_condition_string => create_and_condition(and_condition_string)).
        filter(is_valid_condition);
    if (0 === and_conditions.length) {
        return undefined;
    } else if (1 === and_conditions.length) {
        return and_conditions[0];
    } else {
        return {'or': and_conditions};
    }
}

function create_rule(cldr_rule_object) {
    let keyword;
    let count;
    let condition;
    let condition_string;
    let rule = {};

    for (keyword in cldr_rule_object) {
        if (cldr_rule_object.hasOwnProperty(keyword)) {
            condition_string = extract_condition(cldr_rule_object[keyword]);
            condition = create_condition(condition_string);
            if (undefined !== condition) {
                count = extract_count(keyword);
                rule[count] = condition;
            }
        }
    }
    return rule;
}

function calcLocalePath(language, script, region) {
    let fullpath = `${moduleRoot}/locale`;
    if (language) {
        fullpath = path.join(fullpath, language);
    }
    if (script) {
        fullpath = path.join(fullpath, script);
    }
    if (region) {
        fullpath = path.join(fullpath, region);
    }
    return fullpath;
}

function anyProperties(data) {
    let count = 0;
    for (let prop in data) {
        if (prop && data[prop]) {
            count++;
        }
        if (count >= 1) {
            return true;
        }
    }
    return false;
}

function writePluralsData(locale, data) {
    const language = locale.getLanguage(),
        script = locale.getScript(),
        region = locale.getRegion();

    const fullpath = calcLocalePath(language, script, region);

    if (data) {
        console.log("Writing " + fullpath);
        makeDirs(fullpath);
        fs.writeFileSync(path.join(fullpath, "plurals.json"), stringify(data, {space: 4}), "utf-8");
    } else {
        console.log("Skipping empty  " + fullpath);
    }
}

for (let language in pluralsObject) {
    let pluralsData;

    if (language && pluralsObject[language]) {
        pluralsData = create_rule(pluralsObject[language]);

        if (anyProperties(pluralsData)) {
            const locale = new Locale(language);
            writePluralsData(locale, pluralsData);
        }
    }
}