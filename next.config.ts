import { execSync } from 'node:child_process';
import type { NextConfig } from 'next';

let commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA;
if (!commitSha) {
    try {
        commitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
        // not in a git repo
    }
}

const nextConfig: NextConfig = {
    output: 'export',
    trailingSlash: true, // GitHub Pages: emits /nl/index.html, resolves both /nl and /nl/
    images: {
        // Static export has no image server to resize/reformat on the fly; source assets
        // are pre-sized and pre-compressed instead (see public/ images).
        unoptimized: true,
    },
    env: {
        NEXT_PUBLIC_COMMIT_SHA: commitSha,
    },
};

export default nextConfig;
