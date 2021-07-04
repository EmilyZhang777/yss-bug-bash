const { exec } = require('promisify-child-process');
const fs = require('fs');
const path = require('path');
const glob = require('glob-promise');

const ASSETS_DIRECTORY = 'assets/modules';
const SOYDIRECTORIES_FILE = 'soydirectories.json';
const YEXT_COMPONENT_PATTERN = '@yext/components-';
const submodulesWithDependencies = [
  '@yext/pages-buildtools'
];

/**
 * @param {string} versionA Package version of the form '1.2.3'
 * @param {string} versionB Package version of the form '1.2.3'
 * @returns {number} Negative if versionB newer than versionA, 0 if same, positive if versionA newer than versionB
 */
function versionCompare(versionA, versionB) {
  const aParts = versionA.split('.');
  const bParts = versionB.split('.');

  for (let i = 0; i < aParts.length && i < bParts.length; i++) {
    if (aParts[i] != bParts[i]) {
      return parseInt(aParts[i]) - parseInt(bParts[i]);
    }
  }

  return aParts.length - bParts.length;
}

/**
 * Find all components installed as node modules within component node modules.
 * Components will only be installed as submodules if they are depended on for a version different
 * from the version in package.json
 * @async
 * @returns {Object} The dependencies and version of each component
 */
async function getNestedComponentModules() {
  const componentDependencies = {};
  const { stdout } = await exec(`yarn list --depth 1 --pattern '${YEXT_COMPONENT_PATTERN}'`);

  // In case yarn list ever changes their output format, don't look for specific characters.
  // Instead, assume that dependencies are indented more on the line below their parent
  let currentPackage;
  let packageStartIndex;

  for (const line of stdout.split('\n')) {
    const startIndex = line.indexOf(YEXT_COMPONENT_PATTERN);

    if (startIndex == -1) {
      continue;
    }

    const versionedPackage = line.substr(startIndex);
    const version = versionedPackage.replace(/.*@/, '');
    const package = versionedPackage.replace('@' + version, '');

    if (!currentPackage) {
      packageStartIndex = startIndex;
    }

    if (startIndex == packageStartIndex) {
      currentPackage = package;
      componentDependencies[package] = { dependencies: {}, version };
    } else {
      componentDependencies[currentPackage].dependencies[package] = version;
    }
  }

  return componentDependencies;
}

/**
 * Ensure that no two Yext components depend on different versions of another Yext component
 * @async
 */
async function checkComponentDependencies() {
  const [packageJsonDeps, components] = await Promise.all([
    fs.promises.readFile('./package.json').then(content => JSON.parse(content).dependencies),
    getNestedComponentModules()
  ]);
  const conflicts = {}; // Object of the form [component][version][components depending on version]

  for (const component in components) {
    if (!(component in packageJsonDeps)) {
      conflicts[component] = conflicts[component] || {};
      conflicts[component][components[component].version] = conflicts[component][components[component].version] || [];
    }

    for (const [dependency, version] of Object.entries(components[component].dependencies)) {
      conflicts[dependency] = conflicts[dependency] || {};
      conflicts[dependency][version] = conflicts[dependency][version] || [];
      conflicts[dependency][version].push(component);
    }
  }

  if (!Object.keys(conflicts).length) {
    return;
  }

  let errorMsg = 'Component version conflicts or missing dependencies\n\nResolve the following issues and install again:\n';
  const newestVersions = {}; // The newest version depended on for each component

  for (const [component, otherVersions] of Object.entries(conflicts).sort(([nameA], [nameB]) => nameA.localeCompare(nameB))) {
    if (component in packageJsonDeps) {
      errorMsg += `- ${component} -- Version in package.json: ${packageJsonDeps[component]}\n`;
      newestVersions[component] = packageJsonDeps[component];
    } else {
      errorMsg += `- ${component} -- Missing in package.json\n`;
      newestVersions[component] = component in components ? components[component].version : '0';
    }

    Object.entries(otherVersions)
      .sort(([versionA], [versionB]) => versionCompare(versionA, versionB))
      .forEach(([version, otherComponents]) => {
        if (otherComponents.length) {
          errorMsg += `  - Version ${version} depended on by:\n`
          otherComponents.forEach(otherComponent => errorMsg += `    - ${otherComponent}\n`);
        }

        if (versionCompare(version, newestVersions[component]) > 0) {
          newestVersions[component] = version;
        }
      });
  }

  // Map of component to the version needed to upgrade to
  const upgradesNeeded = Object.fromEntries(Object.entries(newestVersions)
    .filter(([component, version]) => version !== packageJsonDeps[component])
  );

  for (const component in conflicts) {
    for (const version in conflicts[component]) {
      if (version != newestVersions[component]) {
        // Upgrade all components relying on old versions
        for (const otherComponent of conflicts[component][version]) {
          // If otherComponent is not already being upgraded to a newer version, set it to latest
          if (!(otherComponent in newestVersions && versionCompare(newestVersions[otherComponent], packageJsonDeps[otherComponent]) > 0)) {
            upgradesNeeded[otherComponent] = 'latest';
          }
        }
      }
    }
  }

  const fixCommand = 'yarn add --exact ' + Object.entries(upgradesNeeded)
      .map(([component, version]) => `${component}@${version}`)
      .sort()
      .join(' \\\n  ');

  errorMsg += '\n***** RECOMMENDED FIXES *****\n'
    + fixCommand + '\n';

  throw new Error(errorMsg);
}

/**
 * Scan directories for templates
 * @async
 */
async function scanDirs() {
  const soyDirs = new Set();
  const files = await glob.promise('!(templates)/**/*.soy', { follow: true });

  files.forEach(file => {
    // only allow top-level node_modules templates
    if ((file.match(/node_modules/g) || []).length <= 1) {
      soyDirs.add(path.dirname(file));
    }
  });

  // Always look in the templates folder, after the components folders
  const results = [...soyDirs, 'templates'];
  const data = JSON.stringify(results, null, 2);

  await fs.promises.writeFile(SOYDIRECTORIES_FILE, data);
}

/**
 * Copy assets from node modules into src/assets/modules so that node module components can use them
 * @async
 */
async function copyModuleAssets() {
  const [files] = await Promise.all([
    // Find all files in src/assets in node modules
    glob.promise('node_modules/@yext/*/src/assets/*', { follow: true, nodir: true, nosort: true }),
    // Empty the existing assets/modules folder
    fs.promises.rmdir(ASSETS_DIRECTORY, { recursive: true })
      .then(() => fs.promises.mkdir(ASSETS_DIRECTORY, { recursive: true }))
  ]);

  await Promise.all(files.map(file =>
    fs.promises.copyFile(file, `${ASSETS_DIRECTORY}/${path.basename(file)}`)
  ));
}

async function installSubmoduleDependencies() {
  const promises = [];

  for (const submodule of submodulesWithDependencies) {
    promises.push(exec(`cd node_modules/${submodule} && yarn install`));
  }

  await Promise.all(promises);
}

// Main function
(async function () {
  await Promise.all([
    checkComponentDependencies(),
    scanDirs(),
    copyModuleAssets(),
    installSubmoduleDependencies()
  ]);
})();
