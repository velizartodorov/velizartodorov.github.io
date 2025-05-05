const fs = require('fs');
const path = require('path');

const requiredDependencies = [
  'react', 'react-dom', 'react-scripts', 'typescript'
];

const checkPackages = (packageJsonPath) => {
  const rawData = fs.readFileSync(packageJsonPath);
  const pkg = JSON.parse(rawData);

  const dependencies = pkg.dependencies || {};
  const devDependencies = pkg.devDependencies || {};
  const allDeps = { ...dependencies, ...devDependencies };

  let hasIssues = false;

  console.log('🔍 Checking for required packages...');
  requiredDependencies.forEach(dep => {
    if (!allDeps[dep]) {
      console.error(`❌ Missing required dependency: ${dep}`);
      hasIssues = true;
    }
  });

  Object.entries(allDeps).forEach(([dep, version]) => {
    if (!version.startsWith('^') && !version.startsWith('~')) {
      console.warn(`⚠️ Dependency "${dep}" has no ^ or ~ version range: ${version}`);
    }
  });

  if (hasIssues) {
    process.exit(1); // fail the workflow
  } else {
    console.log('✅ All required packages are present.');
  }
};

const filePath = path.join(__dirname, 'package.json');
checkPackages(filePath);
