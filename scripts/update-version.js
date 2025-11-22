/**
 * Script pour mettre à jour la version dans tous les fichiers
 * Usage: node scripts/update-version.js 1.0.0
 */

const fs = require('fs');
const path = require('path');

const newVersion = process.argv[2];

if (!newVersion || !/^\d+\.\d+\.\d+$/.test(newVersion)) {
  console.error('Usage: node scripts/update-version.js <version>');
  console.error('Exemple: node scripts/update-version.js 1.0.0');
  process.exit(1);
}

// Mettre à jour package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`✅ Version mise à jour à ${newVersion} dans package.json`);

