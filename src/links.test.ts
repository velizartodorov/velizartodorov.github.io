// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Employment } from './components/employments/employment';
import type { IEducation } from './components/education/education.init';

const __dirname = dirname(fileURLToPath(import.meta.url));
const translationsDir = resolve(__dirname, 'translations/en');

function readJson<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8')) as T;
}

function collectEmploymentLinks(): { url: string; label: string }[] {
  const index = readJson<{ list: string[] }>(join(translationsDir, 'employments.json'));
  const links: { url: string; label: string }[] = [];
  for (const filename of index.list) {
    const data = readJson<Employment>(join(translationsDir, 'employments', filename));
    for (const position of data.positions) {
      for (const ref of position.references ?? []) {
        links.push({ url: ref.href, label: `[${data.company}] ${ref.value}` });
      }
    }
  }
  return links;
}

function collectEducationLinks(): { url: string; label: string }[] {
  const data = readJson<{ list: IEducation[] }>(join(translationsDir, 'education.json'));
  const links: { url: string; label: string }[] = [];
  for (const entry of data.list) {
    for (const ref of entry.references ?? []) {
      links.push({ url: ref.href, label: `[Education: ${entry.occupation ?? 'unknown'}] ${ref.value}` });
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

describe('external links', () => {
  it.concurrent.each(allLinks)('$label — $url', { timeout: 15_000, retry: { count: 2, delay: 1_000 } }, async ({ url }) => {
    const opts = { signal: AbortSignal.timeout(10_000), headers: { 'User-Agent': 'Mozilla/5.0 link-checker', 'Accept': 'text/html,application/xhtml+xml,*/*' } };
    const response = await fetch(url, { method: 'GET', ...opts });
    expect(
      response.ok,
      `Expected 2xx but got ${response.status} for ${url}`,
    ).toBe(true);
  });
});
