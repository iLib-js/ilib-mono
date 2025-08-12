/*
 * LoaderFactory.js - shared loader registration and factory logic
 *
 * Copyright © 2022, 2025 JEDLSoft
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

import { getPlatform, top } from 'ilib-env';
import Loader from './Loader.js';

/**
 * Register a loader with the loader factory. The loader must return
 * which platforms it is a loader for.
 *
 * @param {Class} loaderClass a loader class from which to make an instance
 */
export function registerLoader(loaderClass) {
    if (!loaderClass) return;

    const globalScope = top();
    
    if (!globalScope.ilib) {
        globalScope.ilib = {};
    }
    if (!globalScope.ilib.classCache) {
        globalScope.ilib.classCache = {};
    }

    var loader = new loaderClass();
    const platforms = loader.getPlatforms();
    if (platforms) {
        platforms.forEach((platform) => {
            globalScope.ilib.classCache[platform] = loader;
        });
    }
}

/**
 * Factory method that returns a loader instance that is appropriate
 * for the current platform. The current platform is determined using
 * the ilib-env package.
 *
 * @returns {Loader} a loader instance for this platform
 */
export function LoaderFactory() {
    const globalScope = top();

    if (!globalScope.ilib || !globalScope.ilib.classCache) {
        return undefined;
    }

    // special case because Webpack is not a platform:
    if (typeof(__webpack_require__) !== 'undefined' && globalScope.ilib.classCache.webpack) {
        return globalScope.ilib.classCache.webpack;
    } else {
        const platform = getPlatform();
        if (globalScope.ilib.classCache[platform]) {
            return globalScope.ilib.classCache[platform];
        }
    }

    // No loader -- this platform is required to have all of the ilib data
    // built-in.
    return undefined;
}

export { Loader }; 