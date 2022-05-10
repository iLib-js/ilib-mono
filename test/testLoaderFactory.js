/*
 * testloader.js - test the loader factory
 *
 * Copyright © 2022 JEDLSoft
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

import { setPlatform, getPlatform } from 'ilib-env';
import LoaderFactory, { registerLoader } from '../src/index';
import MockLoader from './MockLoader';

export const testLoaderFactory = {
    testLoaderFactoryNode: function(test) {
        setPlatform(undefined); // clear whatever other tests put there
        if (getPlatform() === "browser") {
            // this test doesn't work on browsers because there are no
            // loaders except the web loader
            test.done();
            return;
        }
        test.expect(2);
        setPlatform("nodejs");
        var loader = LoaderFactory();
        test.equal(loader.getName(), "Nodejs Loader");
        test.equalIgnoringOrder(loader.getPlatforms(), ["nodejs", "webos"]);
        test.done();
    },

    testLoaderFactoryNodeAlt: function(test) {
        setPlatform(undefined); // clear whatever other tests put there
        if (getPlatform() === "browser") {
            // this test doesn't work on browsers because there are no
            // loaders except the web loader
            test.done();
            return;
        }
        test.expect(2);
        registerLoader(MockLoader);
        setPlatform("mock");

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");
        test.equalIgnoringOrder(loader.getPlatforms(), ["mock"]);
        test.done();
    },

    testLoaderFactoryNodeNone: function(test) {
        setPlatform(undefined); // clear whatever other tests put there
        if (getPlatform() === "browser") {
            // this test doesn't work on browsers because there are no
            // loaders except the web loader
            test.done();
            return;
        }
        test.expect(1);
        setPlatform("foo");

        var loader = LoaderFactory();
        test.ok(!loader);
        test.done();
    },

    testLoaderFactoryWeb: function(test) {
        setPlatform(undefined); // clear whatever other tests put there
        if (getPlatform() !== "browser") {
            // this test doesn't work on browsers because there are no
            // loaders except the web loader
            test.done();
            return;
        }
        test.expect(2);
        var loader = LoaderFactory();
        test.equal(loader.getName(), "Webpack Loader");
        test.equalIgnoringOrder(loader.getPlatforms(), ["browser"]);
        test.done();
    }
};
