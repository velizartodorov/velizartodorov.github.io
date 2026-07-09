// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const layoutSource = readFileSync(resolve(__dirname, 'app/layout.tsx'), 'utf8');

const idMatch = layoutSource.match(/GA_MEASUREMENT_ID = '([^']+)'/);
if (!idMatch) throw new Error('Could not find GA_MEASUREMENT_ID in src/app/layout.tsx');
const measurementId = idMatch[1];

// Same shape as a real GA4 ID, but a value Google has never issued - the "unregistered" control.
const UNREGISTERED_CONTROL_ID = 'G-0000000000';

describe('Google Analytics measurement ID', () => {
    it('matches the GA4 measurement ID format (G-XXXXXXXXXX)', () => {
        expect(measurementId).toMatch(/^G-[A-Z0-9]{6,12}$/);
    });

    it('is registered with Google Tag Manager', { timeout: 15_000, retry: { count: 2, delay: 1_000 } }, async () => {
        const fetchGtagJs = (id: string) =>
            fetch(`https://www.googletagmanager.com/gtag/js?id=${id}`, {
                signal: AbortSignal.timeout(10_000),
            }).then((response) => {
                if (!response.ok) throw new Error(`gtag.js request for ${id} returned ${response.status}`);
                return response.text();
            });

        const [ours, control] = await Promise.all([fetchGtagJs(measurementId), fetchGtagJs(UNREGISTERED_CONTROL_ID)]);

        // Google inlines the property's own config into gtag.js for IDs that are actually
        // registered; unregistered IDs (including fabricated ones) fall back to a fixed,
        // shorter stub. A registered ID's script is reliably tens of KB larger than the
        // fallback - that gap is our "connected to Google Analytics" signal.
        expect(ours.length).toBeGreaterThan(control.length + 10_000);
    });
});
