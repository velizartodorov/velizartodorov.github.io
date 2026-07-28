import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import Presentations from './presentations';
import { AccordionProvider } from '../common/accordion_provider';
import { createLangInstance } from '../../app/translations/i18n';
import { loadResources } from '../../app/translations/resources';
import { mockIntersectionObserver } from '../../test-utils/mock-intersection-observer';
import { mockMatchMedia } from '../../test-utils/mock-match-media';

let enResources: Awaited<ReturnType<typeof loadResources>>;

beforeAll(async () => {
    enResources = await loadResources('en');
});

// Presentations renders its own Timeline internally but, like the real page, relies on an
// ancestor AccordionProvider (mounted once in App.tsx) for TimelineEntry's useTimelineNode - see
// education.test.tsx for the same pattern.
describe('Presentations', () => {
    it('renders the section title and each presentation as a link', () => {
        mockIntersectionObserver();
        mockMatchMedia();
        const instance = createLangInstance('en', enResources);
        render(
            <I18nextProvider i18n={instance}>
                <AccordionProvider>
                    <Presentations />
                </AccordionProvider>
            </I18nextProvider>,
        );

        expect(screen.getByRole('heading', { level: 4, name: /Presentations/ })).toBeInTheDocument();

        const link = screen.getByRole('link', { name: /Git workflows presentation/ });
        expect(link).toHaveAttribute('href', 'https://www.slideshare.net/slideshow/git-workflows-256351424/256351424');
    });
});
