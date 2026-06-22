const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packageJsonPath = path.join(root, 'package.json');
const packageSolutionPath = path.join(root, 'config', 'package-solution.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function toSpfxVersion(version) {
  const parts = String(version).split('.');
  if (parts.length !== 3 || parts.some((part) => !/^\d+$/.test(part))) {
    throw new Error(`Versão inválida no package.json: ${version}. Use MAJOR.MINOR.PATCH.`);
  }

  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
}

const packageJson = readJson(packageJsonPath);
const packageSolutionJson = readJson(packageSolutionPath);
const spfxVersion = toSpfxVersion(packageJson.version);

packageSolutionJson.solution.version = spfxVersion;

if (Array.isArray(packageSolutionJson.solution.features)) {
  packageSolutionJson.solution.features = packageSolutionJson.solution.features.map((feature) => ({
    ...feature,
    version: spfxVersion,
  }));
}

writeJson(packageSolutionPath, packageSolutionJson);

console.log(`SPFx solution version synchronized to ${spfxVersion}`);
