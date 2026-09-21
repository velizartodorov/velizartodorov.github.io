#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { cpSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(rootDir, 'src', 'app', 'translations', 'data', 'assets');
const publicResourcesDir = join(rootDir, 'public', 'resources');

if (process.env.RESOURCES_REPO_TOKEN) {
    execFileSync(
        'git',
        [
            'config',
            '--global',
            `url.https://x-access-token:${process.env.RESOURCES_REPO_TOKEN}@github.com/.insteadOf`,
            'https://github.com/',
        ],
        { cwd: rootDir, stdio: 'inherit' },
    );
}

execFileSync('git', ['submodule', 'update', '--init', '--recursive'], { cwd: rootDir, stdio: 'inherit' });

rmSync(publicResourcesDir, { recursive: true, force: true });
cpSync(assetsDir, publicResourcesDir, { recursive: true });
