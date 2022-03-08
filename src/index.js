/*
 * LoaderFactory.js - create new loader objects or return existing
 * ones
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

import { getPlatform } from 'ilib-env';
import NodeLoader from './NodeLoader';

// import WebpackLoader from 'WebpackLoader';
// import QtLoader from 'QtLoader';
// import RhinoLoader from 'RhinoLoader';
// import RingoLoader from 'RingoLoader';

let classCache = {};

/**
 * Register a loader with the loader factory. The loader must return
 * which platforms it is a loader for.
 *
 * @param {Class} loaderClass a loader class from which to make an instance
 */
export function registerLoader(loaderClass) {
    if (!loaderClass) return;
    var loader = new loaderClass();
    const platforms = loader.getPlatforms();
    if (platforms) {
        platforms.forEach((platform) => {
            classCache[platform] = loader;
        });
    }
};

// Known loaders that ship with this package. You can write your own
// and register it to have your own loader for your own platform, or
// even override the loader for a known platform.

registerLoader(NodeLoader);
// registerLoader(WebpackLoader);
// registerLoader(QtLoader);
// registerLoader(RhinoLoader);
// registerLoader(RingoLoader);

/**
 * Factory method that returns a loader instance that is appropriate
 * for the current platform. The current platform is determined using
 * the ilib-env package.
 *
 * @returns {Loader} a loader instance for this platform
 */
function LoaderFactory() {
    // special case because Webpack is not a platform:
    if (typeof(__webpack_require__) !== 'undefined' && classCache.webpack) {
        return classCache.webpack;
    } else {
        const platform = getPlatform();
        if (classCache[platform]) {
            return classCache[platform];
        }
    }

    // No loader -- this platform is required to have all of the ilib data
    // built-in.
    return undefined;
};

export default LoaderFactory;