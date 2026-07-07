import { describe, expect, it } from 'vitest';
import { resources as enResources } from './en';
import { resources as nlResources } from './nl';

// Each page now only loads its own language's data up front (see i18n.ts), so i18next's
// `fallbackLng: 'en'` can no longer silently paper over a key that exists in one language's
// JSON but not the other's — a visitor to /nl/ simply wouldn't have English data loaded to
// fall back to. This test makes a missing/mismatched key a loud build-time failure instead of
// a silent, un-noticed gap in the live site.
//
// It only checks object KEY structure, not translated string content or array length: arrays
// are allowed to differ in size (translators may reasonably phrase something in more or fewer
// sentences), but every namespace/object key present in one language must be present in the
// other, since that's what a t() call actually depends on.

function objectKeys(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.length > 0 ? objectKeys(value[0]) : [];
    }
    if (value && typeof value === 'object') {
        return Object.keys(value as Record<string, unknown>);
    }
    return [];
}

function collectKeyPaths(value: unknown, prefix = ''): string[] {
    const keys = objectKeys(value);
    if (keys.length === 0) return prefix ? [prefix] : [];

    return keys.flatMap((key) => {
        const path = prefix ? `${prefix}.${key}` : key;
        const child = Array.isArray(value)
            ? (value[0] as Record<string, unknown>)[key]
            : (value as Record<string, unknown>)[key];
        const childKeys = collectKeyPaths(child, path);
        return childKeys.length > 0 ? childKeys : [path];
    });
}

describe('translation completeness (en/nl key parity)', () => {
    const namespaces = Object.keys(enResources) as Array<keyof typeof enResources>;

    it.each(namespaces)('namespace "%s" has the same keys in en and nl', (ns) => {
        const enKeys = new Set(collectKeyPaths(enResources[ns]));
        const nlKeys = new Set(collectKeyPaths(nlResources[ns as keyof typeof nlResources]));

        const missingInNl = [...enKeys].filter((k) => !nlKeys.has(k));
        const missingInEn = [...nlKeys].filter((k) => !enKeys.has(k));

        expect(missingInNl, `keys present in en:${ns} but missing in nl:${ns}`).toEqual([]);
        expect(missingInEn, `keys present in nl:${ns} but missing in en:${ns}`).toEqual([]);
    });
});
