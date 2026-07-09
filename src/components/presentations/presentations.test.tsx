import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import Presentations from './presentations';
import { createLangInstance } from '../../i18n';
import { loadResources } from '../../translations/resources';

let enResources: Awaited<ReturnType<typeof loadResources>>;

beforeAll(async () => {
    enResources = await loadResources('en');
});

describe('Presentations', () => {
    it('renders the section title and each presentation as a link', () => {
        const instance = createLangInstance('en', enResources);
        render(
            <I18nextProvider i18n={instance}>
                <Presentations eventKey="3" />
            </I18nextProvider>,
        );

        expect(screen.getByRole('heading', { level: 4, name: /Presentations/ })).toBeInTheDocument();

        const link = screen.getByRole('link', { name: /Git workflows presentation/ });
        expect(link).toHaveAttribute('href', 'https://www.slideshare.net/slideshow/git-workflows-256351424/256351424');
    });
});
