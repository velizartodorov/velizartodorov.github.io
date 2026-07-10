import { vi } from 'vitest';
import { useTranslation } from 'react-i18next';

type TFunction = (key: string, options?: { ns?: string; returnObjects?: boolean }) => unknown;

// Sets react-i18next's mocked useTranslation() to return the given lookup function. The caller's
// test file must still hoist `vi.mock('react-i18next', () => ({ useTranslation: vi.fn() }))`
// itself (vi.mock is hoisted per-file, so it can't be centralized here).
export function mockUseTranslation(t: TFunction, ready = true) {
    vi.mocked(useTranslation).mockReturnValue({ t: vi.fn(t), ready } as unknown as ReturnType<typeof useTranslation>);
}
