// scripts/generateVersion.js
const fs = require('fs');
const path = require('path');

// --- Define file paths ---
const changelogPath = path.join(__dirname, '../public/changelog.md');
const changelogDataPath = path.join(__dirname, '../src/helpers/changelogData.js');
const packageJsonPath = path.join(__dirname, '../package.json');

try {
    // --- Read source files ---
    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // --- Extract the latest version from changelog ---
    const versionMatch = changelogContent.match(/^## (v[0-9]+\.[0-9]+\.[0-9]+)/m);
    
    if (!versionMatch || !versionMatch[1]) {
        throw new Error("Could not find version number in changelog.md");
    }

    const versionWithV = versionMatch[1]; // e.g., "v0.7.0"
    const cleanVersion = versionWithV.replace('v', ''); // e.g., "0.7.0"

    // --- 1. Update package.json ---
    packageJson.version = cleanVersion;
    // Write back to the file with pretty formatting (2-space indent) and a trailing newline
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
    console.log(`Successfully updated package.json to version ${cleanVersion}`);

    // --- 2. Update the JS version file ---
    const fileContent = `export const appVersion = "${versionWithV} (Prototype)";\n`;
    fs.writeFileSync(changelogDataPath, fileContent, 'utf8');
    console.log(`Successfully generated version ${versionWithV} in ${changelogDataPath}`);

} catch (error) {
    console.error("Failed to update version files:", error);
    process.exit(1);
}