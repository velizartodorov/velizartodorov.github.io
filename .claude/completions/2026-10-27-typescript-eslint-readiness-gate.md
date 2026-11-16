# TypeScript ESLint Readiness Gate

- Added a build-time npm peer-resolution gate for the latest TypeScript 7 and typescript-eslint packages.
- The gate checks candidate package versions against the current lockfile and reports the manual update needed.
- Updated PR #447 to explain that cross-repository issue events cannot trigger this PR's workflow; a dependency update and push is required after compatible packages are published.
- Verified the current registry fails the gate because typescript-eslint 8.72.1 requires TypeScript `<6.1.0`.
- `node --check`, workflow YAML parsing, and `git diff --check` passed. `package-lock.json` remains unchanged.
