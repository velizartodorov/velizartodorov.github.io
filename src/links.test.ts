// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { load } from 'js-yaml';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import { toString as mdastToString } from 'mdast-util-to-string';
import type { Root, Link, List, ListItem } from 'mdast';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { parseFrontmatter } = require('../loaders/markdown-frontmatter-loader.cjs');
const translationsDir = resolve(__dirname, 'app/translations/en');

function readYaml<T>(filePath: string): T {
    return load(readFileSync(filePath, 'utf8')) as T;
}

function readMarkdown(filePath: string): { data: Record<string, unknown>; content: string } {
    return parseFrontmatter(readFileSync(filePath, 'utf8'));
}

// Parse with the same remark parser react-markdown renders through, rather than a hand-rolled
// regex, so link-checking can't silently diverge from what actually renders (a titled link, or a
// URL containing a literal ")", would break a naive `\[...\]\(...\)` regex but renders fine here).
const processor = unified().use(remarkParse);

function collectLinksFromContent(content: string, labelPrefix: string): { url: string; label: string }[] {
    const tree = processor.parse(content) as Root;
    const links: { url: string; label: string }[] = [];
    visit(tree, 'link', (node: Link) => {
        if (/^https?:\/\//.test(node.url))
            links.push({ url: node.url, label: `${labelPrefix} ${mdastToString(node)}` });
    });
    return links;
}

const REFERENCES_HEADING = /^(References|Referenties) 📌$/;

// Guards against a reference bullet silently failing to render as a link at all - e.g. a `]`
// character in the link text (nothing else in the pipeline escapes it) truncates the markdown
// link syntax, leaving plain unlinked text with no build-time signal that anything broke.
function collectMalformedReferenceBullets(content: string, labelPrefix: string): string[] {
    const tree = processor.parse(content) as Root;
    const problems: string[] = [];
    tree.children.forEach((node, i) => {
        if (node.type !== 'paragraph' || !REFERENCES_HEADING.test(mdastToString(node))) return;
        const list = tree.children[i + 1];
        if (!list || list.type !== 'list') return;
        for (const item of (list as List).children as ListItem[]) {
            const itemText = mdastToString(item);
            const linkNodes: Link[] = [];
            visit(item, 'link', (l: Link) => linkNodes.push(l));
            const isCleanLink = linkNodes.length === 1 && mdastToString(linkNodes[0]) === itemText;
            if (!isCleanLink) problems.push(`${labelPrefix} "${itemText}"`);
        }
    });
    return problems;
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

function collectAllMalformedReferenceBullets(): string[] {
    const employmentsIndex = readYaml<{ list: string[] }>(join(translationsDir, 'employments.yml'));
    const educationIndex = readYaml<{ list: string[] }>(join(translationsDir, 'education.yml'));
    const problems: string[] = [];
    for (const filename of employmentsIndex.list) {
        const { data, content } = readMarkdown(join(translationsDir, 'employments', filename));
        problems.push(...collectMalformedReferenceBullets(content, `[${data.company}]`));
    }
    for (const filename of educationIndex.list) {
        const { data, content } = readMarkdown(join(translationsDir, 'education', filename));
        problems.push(...collectMalformedReferenceBullets(content, `[Education: ${data.occupation ?? 'unknown'}]`));
    }
    return problems;
}

describe('reference bullet formatting', () => {
    it('every bullet under a References/Referenties heading is a single, fully-formed link', () => {
        expect(collectAllMalformedReferenceBullets()).toEqual([]);
    });
});

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
