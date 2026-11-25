import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const npmExecPath = process.env.npm_execpath;

if (!npmExecPath) {
  throw new Error('Run this check through npm so the npm executable can be located.');
}

const temporaryDirectory = mkdtempSync(join(tmpdir(), 'typescript-eslint-ts7-'));

try {
  writeFileSync(
    join(temporaryDirectory, 'package.json'),
    JSON.stringify({
      private: true,
      devDependencies: {
        typescript: '^7.0.0',
        'typescript-eslint': 'latest',
      },
    }),
  );

  const resolution = spawnSync(
    process.execPath,
    [
      npmExecPath,
      'install',
      '--package-lock-only',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--strict-peer-deps',
    ],
    { cwd: temporaryDirectory, encoding: 'utf8' },
  );

  if (resolution.error) {
    throw resolution.error;
  }

  if (resolution.status !== 0) {
    const output = `${resolution.stdout}\n${resolution.stderr}`;

    if (!output.includes('ERESOLVE')) {
      throw new Error(`Unable to check published package compatibility:\n${output}`);
    }

    console.error(
      'No published typescript-eslint release currently resolves with TypeScript 7. ' +
        'This gate checks npm peer dependencies rather than upstream issue status.',
    );
    console.error(resolution.stderr);
    process.exitCode = 1;
  } else {
    const currentLock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
    const candidateLock = JSON.parse(
      readFileSync(join(temporaryDirectory, 'package-lock.json'), 'utf8'),
    );
    const checkedPackages = [
      'node_modules/typescript',
      'node_modules/typescript-eslint',
      'node_modules/@typescript-eslint/parser',
      'node_modules/@typescript-eslint/typescript-estree',
    ];
    const outdatedPackages = checkedPackages.flatMap((packagePath) => {
      const currentVersion = currentLock.packages[packagePath]?.version;
      const candidateVersion = candidateLock.packages[packagePath]?.version;

      return currentVersion === candidateVersion
        ? []
        : [`${packagePath}: locked ${currentVersion ?? 'missing'}, compatible release ${candidateVersion ?? 'missing'}`];
    });

    if (outdatedPackages.length > 0) {
      console.error(
        'A compatible TypeScript 7 release is published, but this lockfile does not use it. ' +
          'Update typescript-eslint and the TypeScript 7 lockfile, remove the temporary peer overrides, then push to rerun CI.',
      );
      console.error(outdatedPackages.join('\n'));
      process.exitCode = 1;
    } else {
      console.log('The locked TypeScript and typescript-eslint packages match a published compatible release.');
    }
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
