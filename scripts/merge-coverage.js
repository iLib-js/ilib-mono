const fs = require('fs');
const path = require('path');

const coverageFiles = fs.readdirSync('packages').filter(dir => fs.existsSync(path.join('packages', dir, 'coverage.txt'))).map(dir => path.join('packages', dir, 'coverage.txt'));

const mergedCoverage = [];

coverageFiles.forEach(file => {
    const data = fs.readFileSync(file, 'utf-8');
    const lines = data.split('\n');
    let dirName = '';

    lines.forEach(line => {
        if (line.startsWith(" ")) {
            const [first] = line.split("|");
            const regex = /\..*$/;

            if (first.trim().startsWith('index.')) {
                return
            }

            if (regex.test(first.trim())) {
                mergedCoverage.push(` ${line.trim()}`);
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
