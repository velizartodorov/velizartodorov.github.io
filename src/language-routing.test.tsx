import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, act, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import React from 'react';
import i18n, { i18nInstance } from './i18n';
import { LangRoute } from './App';
import { LanguageSelector } from './components/common/language_selector';

vi.mock('./components/introduction/introduction', () => ({ default: () => null }));
vi.mock('./components/employments/employments', () => ({ default: () => null }));
vi.mock('./components/licenses_certifications/licenses_certifications', () => ({ default: () => null }));
vi.mock('./components/presentations/presentations', () => ({ default: () => null }));
vi.mock('./components/languages/languages', () => ({ default: () => null }));
vi.mock('./components/education/education', () => ({ default: () => null }));

beforeAll(async () => {
  await i18nInstance;
});

beforeEach(async () => {
  await act(async () => { await i18n.changeLanguage('en'); });
});

afterEach(() => {
  document.documentElement.lang = 'en';
  document.querySelectorAll('link[rel="canonical"], link[hreflang]').forEach(el => el.remove());
});

function Wrapper({ children, initialEntries = ['/'] }: { children: React.ReactNode; initialEntries?: string[] }) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </MemoryRouter>
  );
}

function LocationDisplay() {
  return <span data-testid="path">{useLocation().pathname}</span>;
}

// ─── URL logic ───────────────────────────────────────────────────────────────

describe('GitHub Pages redirect detection', () => {
  const isPathRedirect = (search: string) =>
    search.length > 0 && !search.slice(1).includes('=');

  it('detects bare path redirects (no = in search)', () => {
    expect(isPathRedirect('?nl')).toBe(true);
    expect(isPathRedirect('?nl/')).toBe(true);
    expect(isPathRedirect('?about')).toBe(true);
    expect(isPathRedirect('?some/path')).toBe(true);
  });

  it('does not trigger on query params', () => {
    expect(isPathRedirect('?lang=nl')).toBe(false);
    expect(isPathRedirect('?utm_source=')).toBe(false);
    expect(isPathRedirect('?ref=abc')).toBe(false);
  });

  it('does not trigger on empty search', () => {
    expect(isPathRedirect('')).toBe(false);
  });
});

describe('language detection from pathname', () => {
  const getLang = (pathname: string): 'en' | 'nl' =>
    pathname === '/nl' || pathname.startsWith('/nl/') ? 'nl' : 'en';

  it('returns nl for /nl and /nl/* paths', () => {
    expect(getLang('/nl')).toBe('nl');
    expect(getLang('/nl/')).toBe('nl');
    expect(getLang('/nl/section')).toBe('nl');
  });

  it('returns en for English paths', () => {
    expect(getLang('/')).toBe('en');
    expect(getLang('/about')).toBe('en');
  });

  it('enforces word boundary — /nlfoo is not Dutch', () => {
    expect(getLang('/nlfoo')).toBe('en');
    expect(getLang('/nl-version')).toBe('en');
  });
});

// ─── LangRoute component ─────────────────────────────────────────────────────

describe('LangRoute', () => {
  it('sets i18n language to nl', async () => {
    render(
      <Wrapper initialEntries={['/nl']}>
        <Routes>
          <Route path="/nl" element={<LangRoute lang="nl" />} />
        </Routes>
      </Wrapper>
    );
    await waitFor(() => expect(i18n.language).toBe('nl'));
  });

  it('sets i18n language to en', async () => {
    await act(async () => { await i18n.changeLanguage('nl'); });
    render(
      <Wrapper initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LangRoute lang="en" />} />
        </Routes>
      </Wrapper>
    );
    await waitFor(() => expect(i18n.language).toBe('en'));
  });

  it('sets document.documentElement.lang', async () => {
    render(
      <Wrapper initialEntries={['/nl']}>
        <Routes>
          <Route path="/nl" element={<LangRoute lang="nl" />} />
        </Routes>
      </Wrapper>
    );
    await waitFor(() => expect(document.documentElement.lang).toBe('nl'));
  });

  it('sets canonical link for Dutch route', async () => {
    render(
      <Wrapper initialEntries={['/nl']}>
        <Routes>
          <Route path="/nl" element={<LangRoute lang="nl" />} />
        </Routes>
      </Wrapper>
    );
    await waitFor(() => {
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href'))
        .toBe('https://velizartodorov.github.io/nl/');
    });
  });

  it('sets canonical link for English route', async () => {
    render(
      <Wrapper initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LangRoute lang="en" />} />
        </Routes>
      </Wrapper>
    );
    await waitFor(() => {
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href'))
        .toBe('https://velizartodorov.github.io/');
    });
  });

  it('sets hreflang alternate links', async () => {
    render(
      <Wrapper initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LangRoute lang="en" />} />
        </Routes>
      </Wrapper>
    );
    await waitFor(() => {
      expect(document.querySelector('link[hreflang="en"]')?.getAttribute('href'))
        .toBe('https://velizartodorov.github.io/');
      expect(document.querySelector('link[hreflang="nl"]')?.getAttribute('href'))
        .toBe('https://velizartodorov.github.io/nl/');
      expect(document.querySelector('link[hreflang="x-default"]')?.getAttribute('href'))
        .toBe('https://velizartodorov.github.io/');
    });
  });
});

// ─── LanguageSelector component ──────────────────────────────────────────────

describe('LanguageSelector', () => {
  it('navigates to /nl when NL is clicked from English', async () => {
    render(
      <Wrapper initialEntries={['/']}>
        <LanguageSelector />
        <LocationDisplay />
      </Wrapper>
    );
    await userEvent.click(screen.getByRole('button', { name: 'NL' }));
    expect(screen.getByTestId('path').textContent).toBe('/nl');
  });

  it('navigates to / when EN is clicked from Dutch', async () => {
    await act(async () => { await i18n.changeLanguage('nl'); });
    render(
      <Wrapper initialEntries={['/nl']}>
        <LanguageSelector />
        <LocationDisplay />
      </Wrapper>
    );
    await userEvent.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByTestId('path').textContent).toBe('/');
  });

  it('NL button is pressed when Dutch is active', async () => {
    await act(async () => { await i18n.changeLanguage('nl'); });
    render(
      <Wrapper>
        <LanguageSelector />
      </Wrapper>
    );
    expect(screen.getByRole('button', { name: 'NL' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('EN button is pressed when English is active', () => {
    render(
      <Wrapper>
        <LanguageSelector />
      </Wrapper>
    );
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
  });
});
