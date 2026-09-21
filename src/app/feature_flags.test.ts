import { afterEach, describe, expect, it, vi } from 'vitest';
import { isMinimalMode } from './feature_flags';

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('isMinimalMode', () => {
    it('is true when MINIMAL_MODE is "true"', () => {
        vi.stubEnv('MINIMAL_MODE', 'true');
        expect(isMinimalMode()).toBe(true);
    });

    it('is false when MINIMAL_MODE is unset', () => {
        vi.stubEnv('MINIMAL_MODE', '');
        expect(isMinimalMode()).toBe(false);
    });

    it('is false for any value other than "true"', () => {
        vi.stubEnv('MINIMAL_MODE', 'yes');
        expect(isMinimalMode()).toBe(false);
    });
});
