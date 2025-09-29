/*
 * ts-jest-e2e-config.ts - ts-jest configuration for E2E tests
 *
 * Copyright © 2025, Box, Inc.
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

import { createDefaultPreset, type JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
    ...createDefaultPreset(),
    // per current convention, e2e test config should be placed in the test-e2e/ directory
    // so it's already hidden within the rootDir prefix
    testMatch: ["<rootDir>/**/*.e2e.test.?(c|m)(j|t)s"],
};

export default config;
