/*
 * unitfmtpromise.test.js - test the units formatter object
 *
 * Copyright © 2018-2019, 2022, 2024 JEDLSoft
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

import UnitFmt from "../src/UnitFmt.js";
import MeasurementFactory from "../src/MeasurementFactory.js";

describe("testunitfmtpromise", () => {
    test("UnitFormatWithScale1", () => {
        expect.assertions(1);
        const m = MeasurementFactory({
            amount: 3000,
            unit: "meter"
        });
        return UnitFmt.create({
            autoConvert: false,
            sync: false
        }).then(fmt => {
            const str = fmt.format(m);
            expect(str).toBe("3 kilometers");
        });
    });

    test("UnitFormatWithoutScale5", () => {
        expect.assertions(1);
        const m1 = MeasurementFactory({
            unit: "kilowatt hour",
            amount: 1233453
        });

        return UnitFmt.create({
            autoScale: false,
            autoConvert:false,
            sync: false
        }).then(fmt => {
            const str = fmt.format(m1);
            expect(str).toBe("1,233,453 kilowatt-hours");
        });
    });

    test("UnitFormatWithScale11", () => {
        expect.assertions(1);
        const m1 = MeasurementFactory({
            unit: "krunghoonfoop",
            amount: 2
        });

        return UnitFmt.create({
            autoConvert:false,
            sync: false
        }).then(fmt => {
            const str = fmt.format(m1);
            expect(str).toBe("2 krunghoonfoop");
        });
    });

    test("UnitFormatArea2", () => {
        expect.assertions(1);
        const m1 = MeasurementFactory({
            unit: "square centimeter",
            amount: 2
        });

        return UnitFmt.create({
            locale: "ru-RU",
            autoConvert: false,
            sync: false
        }).then(fmt => {
            const str = fmt.format(m1);
            expect(str).toBe("2 квадратных сантиметра");
        });
    });

    test("UnitFormatArea4", () => {
        expect.assertions(1);
        const m1 = MeasurementFactory({
            unit: "square centimeter",
            amount: 1000
        });

        return UnitFmt.create({
            locale: "ko-KR",
            autoConvert: false,
            sync: false
        }).then(fmt => {
            const str = fmt.format(m1);
            expect(str).toBe("1,000제곱센티미터");
        });
    });

    test("UnitFormatArea5", () => {
        expect.assertions(1);
        const m1 = MeasurementFactory({
            unit: "square centimeter",
            amount: 1000
        });

        return UnitFmt.create({
            locale: "fr-FR",
            autoConvert: false,
            scale: false,
            sync: false
        }).then(fmt => {
            const str = fmt.format(m1);
            expect(str).toBe("1 000 centimètres carrés");
        });
    });

    test("UnitFormatPower", () => {
        expect.assertions(1);
        const m1 = MeasurementFactory({
            unit: "kW",
            amount: 1000
        });

        return UnitFmt.create({
            locale: "fr-FR",
            autoConvert: false,
            sync: false
        }).then(fmt => {
            const str = fmt.format(m1);
            expect(str).toBe("1 mégawatt");
        });
    });

    test("UnitFormatPressure", () => {
        expect.assertions(1);
        const m1 = MeasurementFactory({
            unit: "Pa",
            amount: 1000
        });

        return UnitFmt.create({
            locale: "de-DE",
            autoConvert: false,
            autoScale: false,
            sync: false,
            length: "long"
        }).then(fmt => {
            const str = fmt.format(m1);
            expect(str).toBe("1.000 Pascal");
        });
    });

    test("UnitFormatForce", () => {
        expect.assertions(1);
        const m1 = MeasurementFactory({
            unit: "N",
            amount: 100
        });

        return UnitFmt.create({
            locale: "ja-JP",
            autoConvert: false,
            sync: false,
            length: "long"
        }).then(fmt => {
            const str = fmt.format(m1);
            expect(str).toBe("100 ニュートン");
        });
    });
});
