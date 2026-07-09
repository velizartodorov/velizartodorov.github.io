#!/usr/bin/env node
// Detects UTF-8 text that was re-encoded from a different codepage (mojibake),
// the failure mode that corrupted several emoji/symbol characters on this
// project when a rename script read source files with the wrong encoding.
//
// Heuristic: legitimate UTF-8 source/content essentially never contains the
// C1 control codepoints U+0080-U+009F. Those codepoints appear reliably when
// UTF-8 bytes get misread as Windows-1252/Latin-1 and re-encoded to UTF-8.

import { readFileSync } from 'node:fs';

const files = process.argv.slice(2);
if (files.length === 0) {
    process.exit(0);
}

const C1_CONTROL_RANGE = /[\u0080-\u009F]/;
let hasMojibake = false;

for (const file of files) {
    let text: string;
    try {
        text = readFileSync(file, 'utf8');
    } catch {
        continue;
    }

    const lines = text.split('\n');
    lines.forEach((line, i) => {
        if (C1_CONTROL_RANGE.test(line)) {
            hasMojibake = true;
            console.error(`${file}:${i + 1}: possible mojibake (C1 control character found in decoded UTF-8 text)`);
        }
    });
}

if (hasMojibake) {
    console.error(
        '\nOne or more files contain characters consistent with double-encoded UTF-8 (mojibake).\n' +
            'If this is intentional (genuine C1 control usage), adjust scripts/check-mojibake.ts.\n' +
            'Otherwise, check whether a tool that edited these files read them with the wrong encoding.',
    );
    process.exit(1);
}
