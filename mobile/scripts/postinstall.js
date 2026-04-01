const fs = require('fs');
const path = require('path');

function patchPackageJson(resolvedPackageJsonPath, mutate, label) {
  const packageJson = JSON.parse(fs.readFileSync(resolvedPackageJsonPath, 'utf8'));
  const changed = mutate(packageJson);

  if (!changed) {
    console.log(`No patch needed for ${label}`);
    return;
  }

  fs.writeFileSync(resolvedPackageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`Patched ${label}`);
}

function patchTextFile(filePath, transform, label) {
  const source = fs.readFileSync(filePath, 'utf8');
  const next = transform(source);

  if (next === source) {
    console.log(`No patch needed for ${label}`);
    return;
  }

  fs.writeFileSync(filePath, next);
  console.log(`Patched ${label}`);
}

function ensureObject(value) {
  return value && typeof value === 'object' ? value : {};
}

const metroPackageJsonPath = require.resolve('metro/package.json');
patchPackageJson(
  metroPackageJsonPath,
  pkg => {
    pkg.exports = ensureObject(pkg.exports);
    let changed = false;

    if (!pkg.exports['./src/lib/TerminalReporter']) {
      pkg.exports['./src/lib/TerminalReporter'] = './src/lib/TerminalReporter.js';
      changed = true;
    }

    if (!pkg.exports['./src/*']) {
      pkg.exports['./src/*'] = './src/*.js';
      changed = true;
    }

    return changed;
  },
  'metro exports'
);

const metroCachePackageJsonPath = require.resolve('metro-cache/package.json');
patchPackageJson(
  metroCachePackageJsonPath,
  pkg => {
    pkg.exports = ensureObject(pkg.exports);
    let changed = false;

    if (!pkg.exports['./src/stores/*']) {
      pkg.exports['./src/stores/*'] = './src/stores/*.js';
      changed = true;
    }

    if (!pkg.exports['./src/*']) {
      pkg.exports['./src/*'] = './src/*.js';
      changed = true;
    }

    return changed;
  },
  'metro-cache exports'
);

const metroTransformWorkerPackageJsonPath = require.resolve('metro-transform-worker/package.json');
patchPackageJson(
  metroTransformWorkerPackageJsonPath,
  pkg => {
    pkg.exports = ensureObject(pkg.exports);
    if (pkg.exports['./src/*']) return false;
    pkg.exports['./src/*'] = './src/*.js';
    return true;
  },
  'metro-transform-worker exports'
);

const expoMetroConfigRoot = path.dirname(require.resolve('@expo/metro-config/package.json'));
const sourceMapPatchFrom = [
  "const sourceMapString = typeof sourceMapString_1.default !== 'function'",
  '    ? sourceMapString_1.default.sourceMapString',
  '    : sourceMapString_1.default;',
].join('\n');
const sourceMapPatchTo = [
  'const sourceMapModule = sourceMapString_1.default ?? sourceMapString_1;',
  "const sourceMapString = typeof sourceMapModule === 'function'",
  '    ? sourceMapModule',
  '    : sourceMapModule.sourceMapString;',
].join('\n');

patchTextFile(
  path.join(expoMetroConfigRoot, 'build', 'serializer', 'serializeChunks.js'),
  source => source.replace(sourceMapPatchFrom, sourceMapPatchTo),
  '@expo/metro-config serializeChunks'
);

patchTextFile(
  path.join(expoMetroConfigRoot, 'build', 'serializer', 'withExpoSerializers.js'),
  source => source.replace(sourceMapPatchFrom, sourceMapPatchTo),
  '@expo/metro-config withExpoSerializers'
);

const expoCliRoot = path.dirname(require.resolve('@expo/cli/package.json'));
patchTextFile(
  path.join(expoCliRoot, 'build', 'src', 'start', 'server', 'metro', 'instantiateMetro.js'),
  source => source
    .replace(
      'this._logLines.push(// format args like console.log',
      '(this._logLines ??= []).push(// format args like console.log'
    )
    .replace(
      'this._scheduleUpdate();',
      "if (typeof this._scheduleUpdate === 'function') this._scheduleUpdate();"
    ),
  '@expo/cli instantiateMetro'
);
