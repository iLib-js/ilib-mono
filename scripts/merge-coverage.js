const fs = require('fs');
const path = require('path');

/*
    * This script merges multiple code coverage reports from different packages into a single coverage report.
    * It:
    *   1. reads the coverage data from each package's coverage.txt file,
    *   2. processes the data to include the correct file paths, and
    *   3. writes the merged coverage report to a new coverage.txt file in root directory.
    *
    * The merged coverage report is then used to provide data for MishaKav/jest-coverage-comment@main
    * as an input to generate a table with changed files and their code coverage report and uncovered lines.
    * Correct file paths are required to attach correct links to each file name and uncovered line mentioned
    * in the code coverage table for changed files.
*/

const coverageFiles = fs.readdirSync('packages')
    .map(dir => path.join('packages', dir, 'coverage.txt'))
    .filter(file => fs.existsSync(file));

const mergedCoverage = [];

coverageFiles.forEach(file => {
    const [_, packageName] = file.split('/');
    const data = fs.readFileSync(file, 'utf-8');
    const lines = data.split('\n');

    let dir = "";

    lines.forEach(line => {
        if (line.startsWith(" ")) {
            const [name] = line.split("|").map(part => part.trim());
            const regex = /\..*$/;
            const isFile = regex.test(name);

            if (!isFile) {
                dir = name;
            }

            if (isFile) {
                if (packageName === "loctool") {
                    dir = "lib"; // because for some reason directory is not included in the path in coverage.txt report for loctool
                }
                const coverageLine = line.replace(name, `packages/${packageName}/${dir}/${name}`)
                mergedCoverage.push(coverageLine.trim())
            }
        }
    });
});

const output = [
    'File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s',
    '---- | ------- | -------- | ------- | ------- | ----------------'
].concat(mergedCoverage).join('\n');

fs.writeFileSync('coverage.txt', output, 'utf-8');
console.log('Merged coverage report written to coverage.txt');
