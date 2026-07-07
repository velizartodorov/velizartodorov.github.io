// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import matter from 'gray-matter';
import type { Position } from './components/employments/employment';
import type { Reference } from './components/common/reference';

const __dirname = dirname(fileURLToPath(import.meta.url));
const translationsDir = resolve(__dirname, 'translations/en');

function readYaml<T>(filePath: string): T {
    return load(readFileSync(filePath, 'utf8')) as T;
}

function readMarkdownFrontmatter<T>(filePath: string): T {
    return matter(readFileSync(filePath, 'utf8')).data as T;
}

function collectEmploymentLinks(): { url: string; label: string }[] {
    const index = readYaml<{ list: string[] }>(join(translationsDir, 'employments.yml'));
    const links: { url: string; label: string }[] = [];
    for (const filename of index.list) {
        const data = readMarkdownFrontmatter<{ company: string; positions: Array<Pick<Position, 'references'>> }>(
            join(translationsDir, 'employments', filename),
        );
        for (const position of data.positions) {
            for (const ref of position.references ?? []) {
                links.push({ url: ref.href, label: `[${data.company}] ${ref.value}` });
            }
        }
    }
    return links;
}

function collectEducationLinks(): { url: string; label: string }[] {
    const index = readYaml<{ list: string[] }>(join(translationsDir, 'education.yml'));
    const links: { url: string; label: string }[] = [];
    for (const filename of index.list) {
        const entry = readMarkdownFrontmatter<{ occupation: string; references?: Reference[] }>(
            join(translationsDir, 'education', filename),
        );
        for (const ref of entry.references ?? []) {
            links.push({
                url: ref.href,
                label: `[Education: ${entry.occupation ?? 'unknown'}] ${ref.value}`,
            });
        }
    }
    return links;
}

const seen = new Set<string>();
const allLinks = [...collectEmploymentLinks(), ...collectEducationLinks()].filter(({ url }) => {
    if (seen.has(url)) return false;
    seen.add(url);
    return true;
});

// Hosts whose WAF blocks GitHub Actions' shared IP ranges outright (403) even though the
// link works fine for real users. Verified manually. This is an IP/ASN-level block, not
// rate limiting, so retries don't help — warn instead of failing the build.
const UNCHECKABLE_IN_CI = new Set(['www.elo.com']);

describe('external links', () => {
    it.concurrent.each(allLinks)(
        '$label — $url',
        { timeout: 15_000, retry: { count: 2, delay: 1_000 } },
        async ({ url }) => {
            const opts = {
                signal: AbortSignal.timeout(10_000),
                headers: {
                    'User-Agent': 'Mozilla/5.0 link-checker',
                    Accept: 'text/html,application/xhtml+xml,*/*',
                },
            };
            const response = await fetch(url, { method: 'GET', ...opts });
            if (!response.ok && UNCHECKABLE_IN_CI.has(new URL(url).hostname)) {
                console.warn(
                    `${url} returned ${response.status}, but this host is known to block CI traffic — skipping assertion`,
                );
                return;
            }
            expect(response.ok, `Expected 2xx but got ${response.status} for ${url}`).toBe(true);
        },
    );
});
