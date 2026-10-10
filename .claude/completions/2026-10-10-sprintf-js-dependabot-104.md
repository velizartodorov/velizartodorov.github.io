# Dependabot #104 — sprintf-js DoS (no patched version)

- Chain: `gray-matter@4.0.3 → js-yaml@3.15.2 → argparse@1.0.10 → sprintf-js@1.0.3`.
- No fixed sprintf-js release exists, and the advisory covers every version up to 1.1.3. js-yaml@3 only `require`s argparse in `bin/js-yaml.js`, so the library code never reaches it.
- Fix: `"overrides": { "argparse": "^2.0.1" }` (argparse 2 has no dependencies).
- Gotcha: `npm install` on Windows (including `--package-lock-only`) pruned the non-Windows
  `@rolldown/binding-*` and `lightningcss-*` optional entries from the lockfile, which would break Linux CI.
  So I edited the lockfile by hand, deleting only `node_modules/sprintf-js` and
  `node_modules/gray-matter/node_modules/argparse`, then checked it with `npm ci`.
- Verified: `npm run build` and `vitest run` (344 tests) both pass.
