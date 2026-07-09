import { describe, expect, it, vi } from 'vitest';
import reportWebVitals from './reportWebVitals';

vi.mock('web-vitals', () => ({
    onCLS: vi.fn(),
    onINP: vi.fn(),
    onFCP: vi.fn(),
    onLCP: vi.fn(),
    onTTFB: vi.fn(),
}));

describe('reportWebVitals', () => {
    it('does nothing when no callback is provided', async () => {
        const webVitals = await import('web-vitals');

        reportWebVitals();

        expect(webVitals.onCLS).not.toHaveBeenCalled();
    });

    it('registers the callback with every web-vitals metric reporter', async () => {
        const webVitals = await import('web-vitals');
        const onPerfEntry = vi.fn();

        reportWebVitals(onPerfEntry);
        // The reporters are wired up inside a dynamic import() promise chain, so let that resolve.
        await vi.waitFor(() => expect(webVitals.onCLS).toHaveBeenCalledWith(onPerfEntry));

        expect(webVitals.onINP).toHaveBeenCalledWith(onPerfEntry);
        expect(webVitals.onFCP).toHaveBeenCalledWith(onPerfEntry);
        expect(webVitals.onLCP).toHaveBeenCalledWith(onPerfEntry);
        expect(webVitals.onTTFB).toHaveBeenCalledWith(onPerfEntry);
    });
});
