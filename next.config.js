const { execSync } = require('node:child_process');

let commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA;
if (!commitSha) {
    try {
        commitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch {
        // not in a git repo
    }
}

/** @type {import('next').NextConfig} */
module.exports = {
    output: 'export',
    trailingSlash: true, // GitHub Pages: emits /nl/index.html, resolves both /nl and /nl/
    env: {
        NEXT_PUBLIC_COMMIT_SHA: commitSha,
    },
};
