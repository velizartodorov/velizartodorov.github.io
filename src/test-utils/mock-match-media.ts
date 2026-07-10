import { vi } from 'vitest';

type Listener = (event: { matches: boolean }) => void;

// Stubs window.matchMedia, which jsdom doesn't implement. `initialMatches`/the returned
// `fireChange` are only needed by tests that exercise OS-preference-change behavior directly
// (see theme.test.tsx); callers that just need real code depending on matchMedia to not crash
// (e.g. rendering a real ThemeToggle) can ignore the return value.
export function mockMatchMedia(initialMatches = false) {
    let matches = initialMatches;
    const listeners = new Set<Listener>();
    const mql = {
        get matches() {
            return matches;
        },
        media: '(prefers-color-scheme: dark)',
        addEventListener: vi.fn((_event: string, listener: Listener) => {
            listeners.add(listener);
        }),
        removeEventListener: vi.fn((_event: string, listener: Listener) => {
            listeners.delete(listener);
        }),
    };
    vi.stubGlobal(
        'matchMedia',
        vi.fn(() => mql),
    );
    return {
        mql,
        fireChange(next: boolean) {
            matches = next;
            listeners.forEach((listener) => listener({ matches: next }));
        },
    };
}
