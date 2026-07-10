import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import Languages from './languages';
import { createLangInstance } from '../../translations/i18n';
import { loadResources } from '../../translations/resources';

let enResources: Awaited<ReturnType<typeof loadResources>>;

beforeAll(async () => {
    enResources = await loadResources('en');
});

describe('Languages', () => {
    it('renders the section title and each language with its proficiency', () => {
        const instance = createLangInstance('en', enResources);
        render(
            <I18nextProvider i18n={instance}>
                <Languages eventKey="4" />
            </I18nextProvider>,
        );

        expect(screen.getByRole('heading', { level: 4, name: /Languages/ })).toBeInTheDocument();
        expect(screen.getByText('English')).toBeInTheDocument();
        expect(screen.getByText('Dutch')).toBeInTheDocument();
        expect(screen.getByText('Bulgarian')).toBeInTheDocument();
        expect(screen.getByText('Native')).toBeInTheDocument();
    });
});
