/*
 * numplanasync.test.js - Test the phone numbering plan.
 *
 * Copyright © 2018, 2022, 2024 JEDLSoft
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

import NumberingPlan from "../src/NumberingPlan.js";

describe("testnumplanpromise", () => {
    test("NumberingPlanAsync1", () => {
        expect.assertions(2);
        return NumberingPlan.create({
            locale: "en-US",
            sync: false
        }).then(plan => {
            expect(typeof(plan) !== "undefined").toBeTruthy();
            expect(plan.getName()).toBe("US");
        });
    });

    test("NumberingPlanAsync2", () => {
        expect.assertions(2);
        return NumberingPlan.create({
            locale: "de-DE",
            sync: false
        }).then(plan => {
            expect(typeof(plan) !== "undefined").toBeTruthy();
            expect(plan.getName()).toBe("DE");
        });
    });

    test("NumberingPlanAsyncUnknown", () => {
        expect.assertions(2);
        return NumberingPlan.create({
            locale: "unknown-unknown",
            sync: false
        }).then(plan => {
            expect(typeof(plan) !== "undefined").toBeTruthy();
            expect(plan.getName()).toBe("XX");
        });
    });

    test("NumberingPlanAsyncUnrecognized", () => {
        expect.assertions(2);
        return NumberingPlan.create({
            locale: "zu-ZZ",
            sync: false
        }).then(plan => {
            expect(typeof(plan) !== "undefined").toBeTruthy();
            expect(plan.getName()).toBe("XX");
        });
    });
});
