/*
 * pluralforms.ts - defines the plural forms for each locale
 *
 * Copyright © 2024 Box, Inc.
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

import { PluralCategory } from './utils';

export type PluralForm = {
    rules: string;
    categories: PluralCategory[];
}

export type PluralForms = {
    [locale: string]: PluralForm;
}

export const pluralForms: PluralForms = {
    "ja" : {
        "rules" : "nplurals=1; plural=0;",
        "categories" : [
            "other"
        ]
    },
    "zh" : {
        "rules" : "nplurals=1; plural=0;",
        "categories" : [
            "other"
        ]
    },
    "ko" : {
        "rules" : "nplurals=1; plural=0;",
        "categories" : [
            "other"
        ]
    },
    "th" : {
        "rules" : "nplurals=1; plural=0;",
        "categories" : [
            "other"
        ]
    },
    "en" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "de" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "nl" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "sv" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "da" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "no" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "fo" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "es" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "pt" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "it" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "el" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "bg" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "fi" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "et" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "he" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "id" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "eo" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "hu" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "tr" : {
        "rules" : "nplurals=2; plural=n != 1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "fr" : {
        "rules" : "nplurals=2; plural=n>1;",
        "categories" : [
            "one",
            "other"
        ]
    },
    "lv" : {
        "rules" : "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2;",
        "categories" : [
            "zero",
            "one",
            "other"
        ]
    },
    "ga" : {
        "rules" : "nplurals=3; plural=n==1 ? 0 : n==2 ? 1 : 2;",
        "categories" : [
            "one",
            "two",
            "other"
        ]
    },
    "ro" : {
        "rules" : "nplurals=3; plural=n==1 ? 0 : (n==0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "other"
        ]
    },
    "lt" : {
        "rules" : "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "other"
        ]
    },
    "ru" : {
        "rules" : "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "other"
        ]
    },
    "uk" : {
        "rules" : "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "other"
        ]
    },
    "be" : {
        "rules" : "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "other"
        ]
    },
    "sr" : {
        "rules" : "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "other"
        ]
    },
    "hr" : {
        "rules" : "nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "other"
        ]
    },
    "cs" : {
        "rules" : "nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "other"
        ]
    },
    "sk" : {
        "rules" : "nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "other"
        ]
    },
    "pl" : {
        "rules" : "nplurals=3; plural=n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;",
        "categories" : [
            "one",
            "few",
            "many"
        ]
    },
    "sl" : {
        "rules" : "nplurals=4; plural=n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3",
        "categories" : [
            "one",
            "two",
            "few",
            "other"
        ]
    },
    "ar" : {
        "rules" : "nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5;",
        "categories" : [
            "zero",
            "one",
            "two",
            "few",
            "many",
            "other"
        ]
    }
};
