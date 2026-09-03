import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import Languages from './languages';
import { createLangInstance } from '../../app/translations/i18n';
import { loadResources } from '../../app/translations/resources';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';

let enResources: Awaited<ReturnType<typeof loadResources>>;

beforeAll(async () => {
    enResources = await loadResources('en');
});

describe('Languages', () => {
    it('renders the section title and each language with its proficiency', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        const instance = createLangInstance('en', enResources);
        render(
            <I18nextProvider i18n={instance}>
                <Languages />
            </I18nextProvider>,
        );

        expect(screen.getByRole('heading', { level: 4, name: /Languages/ })).toBeInTheDocument();
        for (const { label, proficiency } of enResources.languages.list) {
            expect(screen.getByText(label)).toBeInTheDocument();
            expect(screen.getAllByText(proficiency).length).toBeGreaterThan(0);
        }
    });
});
