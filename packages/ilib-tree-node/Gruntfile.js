/**
 * Gruntfile.js - build the tree-builder project
 *
 * @license
 * Copyright © 2019, JEDLSoft
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

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var debug = grunt.option('mode') === 'dev';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                sourceMap: true,
                presets: [[
                    '@babel/preset-env',
                    {
                        targets: {
                            node: "10",
                            browsers: "cover 99.5%"
                        }
                    }
                ]],
                plugins: [
                    "add-module-exports"
                ],
                minified: !debug,
                comments: false
            },
            dist: {
                files: [{
                    'lib/TreeNode.js': 'src/TreeNode.js'
                }]
            }
        },
        clean: {
            dist: ['lib']
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['babel']);
};
