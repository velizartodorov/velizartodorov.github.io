import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { Language } from '../../app/translations/i18n';
import type { ActiveSection } from './use_active_section';
import { useSectionUrlSync } from './use_section_url_sync';

function renderSync(active: ActiveSection, lang: Language = 'en') {
    return renderHook(({ active, lang }) => useSectionUrlSync(active, lang), {
        initialProps: { active, lang },
    });
}

afterEach(() => {
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
});

describe('useSectionUrlSync', () => {
    it('does not touch history on the initial render', () => {
        const replaceState = vi.spyOn(window.history, 'replaceState');

        renderSync('employments');

        expect(replaceState).not.toHaveBeenCalled();
    });

    it('replaces the path as the active section changes, without adding history entries', () => {
        const replaceState = vi.spyOn(window.history, 'replaceState');
        const pushState = vi.spyOn(window.history, 'pushState');
        const { rerender } = renderSync('introduction');

        rerender({ active: 'employments', lang: 'en' });
        expect(replaceState).toHaveBeenCalledWith(null, '', '/employments/');

        rerender({ active: 'introduction', lang: 'en' });
        expect(replaceState).toHaveBeenLastCalledWith(null, '', '/');

        expect(pushState).not.toHaveBeenCalled();
    });

    it('prefixes the path with the language segment for Dutch', () => {
        const replaceState = vi.spyOn(window.history, 'replaceState');
        const { rerender } = renderSync('introduction', 'nl');

        rerender({ active: 'languages', lang: 'nl' });

        expect(replaceState).toHaveBeenCalledWith(null, '', '/nl/languages/');
    });

    it('leaves history alone when the computed path already matches the current location', () => {
        window.history.replaceState({}, '', '/employments/');
        const replaceState = vi.spyOn(window.history, 'replaceState');
        const { rerender } = renderSync('introduction');

        rerender({ active: 'employments', lang: 'en' });

        expect(replaceState).not.toHaveBeenCalled();
    });
});
