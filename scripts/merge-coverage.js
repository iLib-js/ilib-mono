const fs = require('fs');
const path = require('path');

const coverageFiles = fs.readdirSync('packages')
    .filter(dir => fs.existsSync(path.join('packages', dir, 'coverage.txt')))
    .map(dir => path.join('packages', dir, 'coverage.txt'));

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
