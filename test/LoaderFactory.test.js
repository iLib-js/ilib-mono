/*
 * loader.test.js - test the loader factory
 *
 * Copyright © 2022-2023 JEDLSoft
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

import { setPlatform, getPlatform, clearCache } from 'ilib-env';
import LoaderFactory, { registerLoader } from '../src/index.js';
import MockLoader from './MockLoader.js';

describe("testLoaderFactory", () => {
    // these tests don't work on browsers because there are no
    // loaders except the web loader
    if (getPlatform() === "nodejs") {
        test("LoaderFactoryNode", () => {
            expect.assertions(2);
            clearCache();
            var loader = LoaderFactory();
            expect(loader.getName()).toBe("Nodejs Loader");
            expect(loader.getPlatforms()).toEqual(["nodejs", "webos"]);
        });

        test("LoaderFactoryNodeAlt", () => {
            expect.assertions(2);
            clearCache();
            setPlatform("mock");
            registerLoader(MockLoader);

            var loader = LoaderFactory();
            expect(loader.getName()).toBe("Mock Loader");
            expect(loader.getPlatforms()).toEqual(["mock"]);
        });

        test("LoaderFactoryNodeNone", () => {
            expect.assertions(1);
            clearCache();
            setPlatform("foo");

            var loader = LoaderFactory();
            expect(!loader).toBeTruthy();
        });
    }

    if (getPlatform() === "browser") {
        test("LoaderFactoryWeb", () => {
            expect.assertions(2);
            clearCache();
            var loader = LoaderFactory();
            expect(loader.getName()).toBe("Webpack Loader");
            expect(loader.getPlatforms()).toEqual(["browser"]);
        });
    }
});
