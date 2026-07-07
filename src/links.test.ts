// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const translationsDir = resolve(__dirname, 'translations/en');

function readYaml<T>(filePath: string): T {
    return load(readFileSync(filePath, 'utf8')) as T;
}

function readMarkdown(filePath: string): { data: Record<string, unknown>; content: string } {
    return matter(readFileSync(filePath, 'utf8'));
}

// Reference links are authored as plain markdown links (e.g. "- [value](href)") in each entry's
// body, rather than structured frontmatter - so link-checking has to parse them out of the text.
const MARKDOWN_LINK = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

function collectLinksFromContent(content: string, labelPrefix: string): { url: string; label: string }[] {
    return [...content.matchAll(MARKDOWN_LINK)].map((m) => ({ url: m[2], label: `${labelPrefix} ${m[1]}` }));
}

function collectEmploymentLinks(): { url: string; label: string }[] {
    const index = readYaml<{ list: string[] }>(join(translationsDir, 'employments.yml'));
    const links: { url: string; label: string }[] = [];
    for (const filename of index.list) {
        const { data, content } = readMarkdown(join(translationsDir, 'employments', filename));
        links.push(...collectLinksFromContent(content, `[${data.company}]`));
    }
    return links;
}

function collectEducationLinks(): { url: string; label: string }[] {
    const index = readYaml<{ list: string[] }>(join(translationsDir, 'education.yml'));
    const links: { url: string; label: string }[] = [];
    for (const filename of index.list) {
        const { data, content } = readMarkdown(join(translationsDir, 'education', filename));
        links.push(...collectLinksFromContent(content, `[Education: ${data.occupation ?? 'unknown'}]`));
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
