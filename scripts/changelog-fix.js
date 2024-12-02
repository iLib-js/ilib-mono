const fs = require("fs");
const path = require("path");

const readmes = fs
    .readdirSync("packages")
    .map((package) => `packages/${package}/README.md`)
    .filter((file) => fs.existsSync(file));
for (const file of readmes) {
    console.log(`Processing ${file}`);
    const data = fs.readFileSync(file, "utf8");
    const lines = data.split("\n");

    const startIdx = lines.findIndex((line) => /^#+\s+Release Notes/i.test(line));
    if (startIdx === -1) {
        console.error("No release notes found");
        continue;
    }

    const level = (lines[startIdx].match(/^#+/)?.[0] ?? "").length;

    console.log("Release notes found on line", startIdx + 1);
    const remainingLines = lines.slice(startIdx + 1);

    let endIdx = remainingLines.findIndex((line) => new RegExp(`^${"#".repeat(level)}\\s+\\w+`).test(line));

    if (endIdx === -1) {
        endIdx = remainingLines.length;
    }

    const releaseNotes = [lines[startIdx], ...remainingLines.slice(0, endIdx)].join("\n");

    fs.writeFileSync(path.join(path.dirname(file), "CHANGELOG.md"), releaseNotes);
    console.log("Changelog written to", path.join(path.dirname(file), "CHANGELOG.md"));

    const newReadme = [...lines.slice(0, startIdx), ...lines.slice(startIdx + endIdx + 1)].join("\n");
    fs.writeFileSync(file, newReadme);
    console.log("Readme updated");
}
