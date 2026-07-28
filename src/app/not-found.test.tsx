import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound', () => {
    let replace: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        replace = vi.fn();
        // jsdom's location.replace can't be spied on directly (not a configurable property), so
        // stub the whole global instead.
        vi.stubGlobal('location', { ...window.location, replace });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('redirects to the root', () => {
        render(<NotFound />);

        expect(replace).toHaveBeenCalledWith('/');
    });

    it('renders a heading and a link back home as a no-JS fallback', () => {
        render(<NotFound />);

        expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Go back home' })).toHaveAttribute('href', '/');
    });
});
